import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { ScenarioSets } from "./scenarioSets";
import { Scenarios } from "./scenarios";
import { DiscussionTemplates } from "./discussionTemplates";
import { Discussions } from "./discussions";
import awaitAsyncGenerator from "@babel/runtime/helpers/esm/awaitAsyncGenerator";
import { Categories } from "./categories";
import { Comments } from "./comments";
import { CommentRatings } from "./commentRatings";
import { Groups } from "./groups";
import { Verdicts } from "./verdicts";
import { Personality } from "./personality";
import SimpleSchema from "simpl-schema";

export const Experiments = new Mongo.Collection("experiments");

Experiments.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  name: String,
  description: String,
  groupId: String,
  scenarioSetId: String,
  discussions: [String],
  ratings: [Object],
  "ratings.$.rating": String,
  "ratings.$.responseType": String,
  "ratings.$.reverse": Boolean,
  "ratings.$.scale": SimpleSchema.Integer,
  consensusThreshold: SimpleSchema.Integer,
  leaderVotes: [Object],
  'leaderVotes.$.nominee': String,
  'leaderVotes.$.voters': [String],
  groupLeader: String,
  createdAt: Date,
  createdBy: String,
}).newContext();

Meteor.methods({
  "experiments.create"(
    name,
    description,
    groupId,
    scenarioSetId,
    hasIntroduction,
    consensusThreshold,
    ratings,
    introductionCommentText
  ) {
    check(hasIntroduction, Boolean);
    check(introductionCommentText, String);

    let discussionIds = [];
    //addcheck for user admin/researcher role

    const experiment = {
      name: name,
      description: description,
      groupId: groupId,
      scenarioSetId: scenarioSetId,
      discussions: [],
      ratings: ratings,
      consensusThreshold: consensusThreshold,
      leaderVotes: [],
      groupLeader: "",
      createdAt: new Date(),
      createdBy: Meteor.userId(),
    };

    // Check experiment against schema.
    Experiments.schema.validate(experiment);

    if (Experiments.schema.isValid()) {
      const experimentId = Experiments.insert(experiment);

      // Create intro discussion if needed.
      if (hasIntroduction) {
        const introductionScenario = Scenarios.findOne({
          title: "Default - Introduction",
        })._id;

        const introId = Meteor.call(
          "discussions.insertIntroduction",
          introductionScenario,
          groupId,
          0,
          consensusThreshold
        );

        const mongoModifierObject = {
          $push: { discussions: introId },
        };

        Experiments.schema.validate(mongoModifierObject, { modifier: true });

        if (Experiments.schema.isValid()) {
          Experiments.update(experimentId, mongoModifierObject);
          discussionIds.push(introId);
          Meteor.call(
            "comments.insert",
            introductionCommentText,
            [],
            [],
            introId
          );
        } else {
          console.log("Validation Errors:", Experiments.schema.validationErrors());
        }
      }

      const set = ScenarioSets.findOne({ _id: scenarioSetId });
      const scenarios = Scenarios.find({ _id: { $in: set.scenarios } })
        .fetch()
        .sort((a, b) => {
          // Sort scenarios by the order in which they appear in set's scenarios field.
          return set.scenarios.indexOf(a._id) - set.scenarios.indexOf(b._id);
        });

      // For each scenario get discussion time limit and add to discussion.
      const discs = [];
      for (i = 0; i < scenarios.length; i++) {
        const discussionTemplate = DiscussionTemplates.findOne({
          _id: scenarios[i].discussionTemplateId,
        });

        const discussionId = Meteor.call(
          "discussions.insert",
          scenarios[i]._id,
          groupId,
          discussionTemplate.timeLimit,
          consensusThreshold,
          discussionTemplate.isHui,
          discussionTemplate.isPublic
        );

        discs.push([Discussions.findOne(discussionId), scenarios[i].title]);

        mongoModifierObject = {
          $push: { discussions: discussionId },
        };

        Experiments.schema.validate(mongoModifierObject, { modifier: true });

        if (Experiments.schema.isValid()) {
          Experiments.update(experimentId, mongoModifierObject);
          discussionIds.push(discussionId);
        } else {
          console.log("Validation Errors:", Experiments.schema.validationErrors());
        }
      }

      // To each discussion, add the id for the next the discussion.
      for (let id = 0; id < discussionIds.length - 1; id += 1) {
        mongoModifierObject = {
          $set: { nextDiscussion: discussionIds[id + 1] },
        };

        Discussions.schema.validate(mongoModifierObject, { modifier: true });

        if (Discussions.schema.isValid()) {
          Discussions.update(discussionIds[id], mongoModifierObject);
        } else {
          console.log("Validation Errors:", Discussions.schema.validationErrors());
        }
      }
    } else {
      console.log("Validation Errors:", Experiments.schema.validationErrors());
    }
  },

  //get a random experiment with a non-empty rating
  "experiments.getRandomExperimentForRating"() {
    if (Meteor.isServer) {
      const fetchedExp = Experiments.rawCollection()
        .aggregate([
          { $match: { ratings: { $elemMatch: { rating: { $ne: "" } } } } },
          { $sample: { size: 1 } },
        ])
        .toArray();
      return fetchedExp;
    }
  },

  // this breaks starting the app now, related to losing data from the database?
  "experiments.exportDiscussion"(discussionId) {
    const exportingUserEmails = Meteor.users.findOne(
      { _id: Meteor.userId() },
      { fields: { emails: 1 } }
    );
    let exportingUserEmail;
    if (exportingUserEmails) {
      exportingUserEmail = exportingUserEmails.emails[0].address;
    }
    let experiment = Experiments.findOne({
      discussions: { $elemMatch: { $eq: discussionId } },
    });
    let commentRatings = CommentRatings.find({
      experimentId: experiment._id,
    }).fetch();
    let discussion = Discussions.findOne({ _id: discussionId });
    let scenario = Scenarios.findOne({ _id: discussion.scenarioId });
    let discussionTemplate = DiscussionTemplates.findOne({
      _id: scenario.discussionTemplateId,
    });
    let discussionGroup = Groups.findOne({ _id: experiment.groupId });
    let users = Meteor.users
      .find(
        { _id: { $in: discussionGroup.members } },
        {
          fields: {
            username: 1,
            "profile.userDetails": 1,
            "profile.personality": 1,
          },
        }
      )
      .fetch()
      .sort((a, b) => {
        // Sort users by the order in which they appear in discussionGroup's members field.
        return (
          discussionGroup.members.indexOf(a._id) -
          discussionGroup.members.indexOf(b._id)
        );
      });
    let verdicts = Verdicts.find({ discussionId: discussionId }).fetch();
    users.forEach((user) => {
      if (user.profile?.personality !== undefined) {
        user.profile?.personality.forEach((question) => {
          let questionnaire = Personality.findOne({
            _id: question.questionnaireId,
          });
          question.title = questionnaire.questionnaireName;
          question.text = questionnaire.items[question.item - 1].text;
        });
      }
    });

    let categories = Categories.find({
      _id: { $in: scenario.categoryIds },
    })
      .fetch()
      .sort((a, b) => {
        return (
          scenario.categoryIds.indexOf(a._id) -
          scenario.categoryIds.indexOf(b._id)
        );
      });
    let categoryNames = [];
    categories.forEach((category) => {
      categoryNames.push(category.title);
    });
    let comments = Comments.find({ discussionId: discussionId }).fetch();

    let discussionData = `{
                "experimentDetails": {
                    "experimentName": "${experiment.name}",
                    "experimentDescription": "${experiment.description}",
                    "experimentRatings": ${JSON.stringify(experiment.ratings)},
                },
                "discussionParameters": {
                    "discussionTemplateName": "${discussionTemplate.name}",
                    "discussionTitle": "${scenario.title}",
                    "discussionDescription": "${scenario.description}",
                    "usersAreAnonymous": ${
                      discussionTemplate.usersAreAnonymous
                    },
                    "usersCanSeeTypingNotification": ${
                      discussionTemplate.showTypingNotification
                    },
                    "usersCanEditTheirOwnCommentsAfterPosting": ${
                      discussionTemplate.usersCanEditComments
                    },
                    "usersCanReactToCommentsWithEmojis": ${
                      discussionTemplate.canAddEmojis
                    },
                    "discussionCommentRepliesAreThreaded": ${
                      discussionTemplate.discussionCommentsThreaded
                    },
                    "userProfileInformationIsVisibleInDiscussion": ${
                      discussionTemplate.showProfileInfo
                    },
                    "commentCharacterLimit": ${
                      discussionTemplate.commentCharacterLimit
                    },
                    "discussionTimeLimit": ${discussionTemplate.timeLimit},
                    "discussionIdsPublic": ${discussionTemplate.isPublic},
                    "discussionIdsInHuiFormat": ${discussionTemplate.isHui},
                    "discussionTopicCategories": "${categoryNames.join(", ")}",
                },
                "discussionComments": ${JSON.stringify(comments)},
                "discussionVerdicts" : ${JSON.stringify(verdicts)},
                "commentUserRatings": ${JSON.stringify(commentRatings)},
                "userInformation": ${JSON.stringify(users)},
            }`;

    Email.send({
      to: exportingUserEmail,
      from: "huriwhakatau@gmail.com",
      subject: "Exported data for: " + scenario.title,
      text: "Here's some data, don't spend it all in one place.",
      attachments: [
        {
          // utf-8 string as an attachment
          filename: "Discussion-" + scenario.title + ".json",
          content: discussionData,
        },
      ],
    });
  },

  //moving the group leader vote here so it can be experiment specific
  "experiments.voteLeader"(experimentId, groupId, nominee) {
    check(experimentId, String);
    check(groupId, String);

    const experiment = Experiments.findOne(experimentId);

    let identifier;
    let mongoModifierObject;

    if (experiment.leaderVotes.filter((member) => member.nominee === nominee).length !== 0) {
      identifier = { _id: experimentId, 'leaderVotes.nominee': nominee };
      mongoModifierObject = {
        $push: {
          'leaderVotes.$.voters': Meteor.userId()
        }
      };
    } else {
      identifier = experimentId;
      mongoModifierObject = {
        $push: {
          leaderVotes: {
            nominee: nominee,
            voters: [Meteor.userId()]
          }
        }
      };
    }

    Experiments.schema.validate(mongoModifierObject, { modifier: true });

    if (Experiments.schema.isValid()) {
      Experiments.update(identifier,
        mongoModifierObject,
        function (err, res) {
          if (err) {
            throw err;
          }
          let group = Groups.findOne({ _id: groupId });
          let experiment = Experiments.findOne(
            { _id: experimentId },
            { fields: { leaderVotes: 1 } }
          );
          const numMembers = group.members.length;
          let leaderVotes = experiment.leaderVotes;
          let numVotes = 0;
          for (i = 0; i < leaderVotes.length; i += 1) {
            numVotes += leaderVotes[i].voters.length;
          }

          if (numVotes >= numMembers) { // Should this be == instead of >=?
            const winner = leaderVotes.sort((a, b) => (a.voters.length > b.voters.length) ? -1 : 1)[0].nominee;

            mongoModifierObject = { $set: { groupLeader: winner } };

            Experiments.schema.validate(mongoModifierObject, { modifier: true });

            if (Experiments.schema.isValid()) {
              Experiments.update(experimentId, mongoModifierObject);
            } else {
              console.log("ValidationErrors:", Experiments.schema.validationErrors());
            }
          }
        }
      );
    } else {
      console.log("Validation Errors:", Experiments.schema.validationErrors());
    }
  },

  // Remove an experiment from the experiments collection in the db.
  "experiments.remove"(experimentId) {
    check(experimentId, String);
    //add role check

    Experiments.remove(experimentId);
  },

  "experiments.removeAll"() {
    Experiments.remove({});
  },
});

if (Meteor.isServer) {
  Meteor.publish("experiments", function () {
    return Experiments.find(
      {},
      {
        fields: {
          name: 1,
          description: 1,
          groupId: 1,
          scenarioSetId: 1,
          ratings: 1,
          discussions: 1,
          consensusThreshold: 1,
          leaderVotes: 1,
          groupLeader: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
