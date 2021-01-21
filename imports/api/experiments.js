import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { ScenarioSets } from "./scenarioSets";
import { Scenarios } from "./scenarios";
import { DiscussionTemplates } from "./discussionTemplate";
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
  createdAt: Date,
  createdBy: String,
}).newContext();

Meteor.methods({
  // Insert a category into the category collection in the db.
  // name: the category name
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
      createdAt: new Date(),
      createdBy: Meteor.userId(),
    };

    // Check experiment against schema.
    Experiments.schema.validate(experiment);

    if (Experiments.schema.isValid()) {
      console.log("Successful validation of experiment");
      const experimentId = Experiments.insert(experiment);

      // Create intro discussion if needed.
      if (hasIntroduction) {
        const introductionScenario = Scenarios.findOne({
          title: "Default - Introduction",
        })._id;
        console.log("creating introduction");
        const introId = Meteor.call(
          "discussions.insertIntroduction",
          introductionScenario,
          groupId,
          0,
          consensusThreshold
        );

        console.log("add intro id to exp ", introId);
        const mongoModifierObject = {
          $push: { discussions: introId },
        };

        Experiments.schema.validate(mongoModifierObject, { modifier: true });

        if (Experiments.schema.isValid()) {
          console.log("Successful validation of experiment update object");
          Experiments.update(experimentId, mongoModifierObject);
          console.log("adding intro id to set", introId);
          discussionIds.push(introId);
          Meteor.call(
            "comments.insert",
            introductionCommentText,
            [],
            [],
            introId
          );
          console.log(discussionIds);
        } else {
          console.log(
            "experiment update object validationErrors:",
            Experiments.schema.validationErrors()
          );
        }
      }

      const set = ScenarioSets.findOne({ _id: scenarioSetId });
      const scenarios = Scenarios.find({ _id: { $in: set.scenarios } }).fetch();

      // For each scenario get discussion time limit and add to discussion.
      for (i = 0; i < scenarios.length; i++) {
        console.log("creating discussion");
        const discussionTemplate = DiscussionTemplates.findOne({
          _id: scenarios[i].discussionTemplateId,
        });

        console.log("inserting discussion", discussionTemplate);
        const discussionId = Meteor.call(
          "discussions.insert",
          scenarios[i]._id,
          groupId,
          discussionTemplate.timeLimit,
          consensusThreshold,
          discussionTemplate.isHui,
          discussionTemplate.isPublic
        );

        console.log("adding discussion id to exp", discussionId);

        mongoModifierObject = {
          $push: { discussions: discussionId },
        };

        Experiments.schema.validate(mongoModifierObject, { modifier: true });

        if (Experiments.schema.isValid()) {
          console.log("Successful validation of experiment update object");
          Experiments.update(experimentId, mongoModifierObject);
          console.log("adding disc id to set", discussionId);
          discussionIds.push(discussionId);
          console.log(discussionIds);
        } else {
          console.log(
            "experiment update object validationErrors:",
            Experiments.schema.validationErrors()
          );
        }
      }
      console.log(discussionIds);

      // To each discussion, add the id for the next the discussion.
      for (let id = 0; id < discussionIds.length - 1; id++) {
        console.log(
          "adding nextDiscussionId",
          discussionIds[id],
          " -> ",
          discussionIds[id + 1]
        );

        mongoModifierObject = {
          $set: { nextDiscussion: discussionIds[id + 1] },
        };

        Discussions.schema.validate(mongoModifierObject, { modifier: true });

        if (Discussions.schema.isValid()) {
          console.log("Successful validation of discussion update object");
          Discussions.update(discussionIds[id], mongoModifierObject);
        } else {
          console.log(
            "discussion update object validationErrors:",
            Discussions.schema.validationErrors()
          );
        }
      }
    } else {
      console.log(
        "experiment validationErrors:",
        Experiments.schema.validationErrors()
      );
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
      console.log('fetchedExp', fetchedExp);
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
      .fetch();
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
    }).fetch();
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
                    "discussionIsPublic": ${discussionTemplate.isPublic},
                    "discussionIsInHuiFormat": ${discussionTemplate.isHui},
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

  // Remove an experiment from the experiments collection in the db.
  "experiments.remove"(experimentId) {
    check(experimentId, String);
    //add role check

    Experiments.remove(experimentId);
  },

  //moving the group leader vote here so it can be experiment specific
  "experiments.voteLeader"(experimentId, groupId, userId) {
    check(experimentId, String);
    check(groupId, String);
    check(userId, String);

    const mongoModifierObject = { $inc: { ["leaderVotes." + userId]: 1 } };

    Experiments.schema.validate(mongoModifierObject);

    if (Experiments.schema.isValid()) {
      console.log("Successful validation of experiments update object");
      Experiments.update(
        experimentId,
        mongoModifierObject,
        function (err, res) {
          let member;
          if (err) {
            throw err;
          }
          let group = Groups.findOne({ _id: groupId });
          let experiment = Experiments.findOne(
            { _id: experimentId },
            { fields: { leaderVotes: 1 } }
          );
          let numMembers = group.members.length;
          let leaderVotes = experiment.leaderVotes;
          let numVotes = 0;
          for (member in leaderVotes) {
            numVotes += leaderVotes[member];
          }

          let compare = function (a, b) {
            return b[1] - a[1];
          };

          if (numVotes >= numMembers) {
            let winner = Object.entries(leaderVotes).sort(compare)[0][0];

            mongoModifierObject = { $set: { groupLeader: winner } };

            Experiments.schema.validate(mongoModifierObject);

            if (Experiments.schema.isValid()) {
              console.log("Successful validation of experiments update object");
              Experiments.update(experimentId, mongoModifierObject);
            } else {
              console.log(
                "experiment update object validationErrors:",
                Experiments.schema.validationErrors()
              );
            }
          }
        }
      );
    } else {
      console.log(
        "experiment update object validationErrors:",
        Experiments.schema.validationErrors()
      );
    }
  },

  "experiments.removeAll"() {
    Experiments.remove({});
  },
});

if (Meteor.isServer) {
  // Meteor.call("experiments.exportDiscussion","HaCZyBgCvsayGRMhB");
  if (!process.env.MONGO_URL.includes("juryroom_admin")) {
    console.log("minimongo experiments");
  } else {
    console.log("not minimongo experiments");
  }

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
          leaderVotes: 1,
          groupLeader: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
