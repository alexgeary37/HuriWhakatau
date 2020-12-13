import {Mongo} from "meteor/mongo";
import {Meteor} from "meteor/meteor";
import {check} from "meteor/check";
import {ScenarioSets} from "./scenarioSets";
import {Scenarios} from "./scenarios";
import {DiscussionTemplates} from "./discussionTemplate";
import {Discussions} from "./discussions";
import awaitAsyncGenerator from "@babel/runtime/helpers/esm/awaitAsyncGenerator";
import {Categories} from "./categories";
import {Comments} from "./comments";
import {CommentRatings} from "./commentRatings";
import {Groups} from "./groups";
import {Verdicts} from "./verdicts";
import {Personality} from "./personality";


export const Experiments = new Mongo.Collection("experiments");

Meteor.methods({
    // Insert a category into the category collection in the db.
    // name: the category name
    // Called from *****
    "experiments.create"(
        name,
        description,
        groupId,
        scenarioSetId,
        hasIntroduction,
        ratings,
        introductionCommentText,
    ) {
        check(name, String);
        check(description, String);
        check(groupId, String);
        check(scenarioSetId, String);
        check(ratings, Array);
        check(introductionCommentText, String);

        let discussionIds = [];
        console.log(ratings);
        //addcheck for user admin/researcher role

        const experimentId = Experiments.insert({
            name: name,
            description: description,
            groupId: groupId,
            scenarioSetId: scenarioSetId,
            ratings: ratings,
            createdAt: new Date(),
            createdBy: Meteor.userId(),
        });

        console.log(experimentId);

        //create intro discussion if needed
        if (hasIntroduction) {
            console.log("creating introduction");
            const introId = Meteor.call(
                "discussions.insertIntroduction",
                "wWtYSX9zP7b5yeNo7",
                groupId,
                0
            );
            console.log("adding intro id to exp ", introId);
            Experiments.update(experimentId, {
                $push: {discussions: introId},
            });
            console.log("adding intro id to set", introId);
            discussionIds.push(introId);
            Meteor.call("comments.insert", introductionCommentText, [], [], introId);
            console.log(discussionIds);
        }

        const set = ScenarioSets.findOne({_id: scenarioSetId});
        const scenarios = Scenarios.find({_id: {$in: set.scenarios}}).fetch();
        //for each scenario get discussion time limit and add to discussion
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
                discussionTemplate.isHui,
                discussionTemplate.isPublic,
            );
            console.log("adding discussion id to exp", discussionId);
            Experiments.update(experimentId, {
                $push: {discussions: discussionId},
            });
            console.log("adding disc id to set", discussionId);
            discussionIds.push(discussionId);
            console.log(discussionIds);
        }
        console.log(discussionIds);
        // to each discussion add the id for the next the discussion
        for (let id = 0; id < discussionIds.length - 1; id++) {
            console.log(
                "adding nextDiscussionId",
                discussionIds[id],
                " -> ",
                discussionIds[id + 1]
            );
            Discussions.update(discussionIds[id], {
                $set: {nextDiscussion: discussionIds[id + 1]},
            });
        }
    },

    //get a random experiment with a non-empty rating
    "experiments.getRandomExperimentForRating"() {
        if (Meteor.isServer) {

            const fetchedExp = Experiments.rawCollection().aggregate([
                {$match: {ratings: {$elemMatch: {rating: {$ne: ""}}}}},
                {$sample: {size: 1}}
            ])
                .toArray();
            return fetchedExp;
        }
    },

    "experiments.exportDiscussion"(discussionId) {
        const exportingUserEmails = Meteor.users.findOne({_id: Meteor.userId()},
            {fields: {emails: 1}});
        let experiment = Experiments.findOne({discussions: {$elemMatch: {$eq: discussionId}}})
        let commentRatings = CommentRatings.find({experimentId: experiment._id}).fetch();
        let discussion = Discussions.findOne({_id: discussionId});
        let scenario = Scenarios.findOne({_id: discussion.scenarioId});
        let discussionTemplate = DiscussionTemplates.findOne({_id: scenario.discussionTemplateId});
        let discussionGroup = Groups.findOne({_id: experiment.groupId});
        let users = Meteor.users.find({_id: {$in: discussionGroup.members}},
            {fields: {username: 1, "profile.userDetails": 1, "profile.personality": 1}}).fetch();
        let verdicts = Verdicts.find({discussionId: discussionId}).fetch();
        users.forEach((user) => {
            if (user.profile?.personality !== undefined) {
                console.log("we have userpersonality")
                user.profile?.personality.forEach((question) => {
                    let questionnaire = Personality.findOne({_id: question.questionnaireId});
                    question.title = questionnaire.questionnaireName;
                    question.text = questionnaire.items[question.item - 1].text;
                })
            }
        })

        let categories = Categories.find({_id: {$in: scenario.categoryIds}}).fetch();
        let categoryNames = [];
        categories.forEach((category) => {
            categoryNames.push(category.title);
        })
        let comments = Comments.find({discussionId: discussionId}).fetch();

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
                    "usersAreAnonymous": ${discussionTemplate.usersAreAnonymous},
                    "usersCanSeeTypingNotification": ${discussionTemplate.showTypingNotification},
                    "usersCanEditTheirOwnCommentsAfterPosting": ${discussionTemplate.usersCanEditComments},
                    "usersCanReactToCommentsWithEmojis": ${discussionTemplate.canAddEmojis},
                    "discussionCommentRepliesAreThreaded": ${discussionTemplate.discussionCommentsThreaded},
                    "userProfileInformationIsVisibleInDiscussion": ${discussionTemplate.showProfileInfo},
                    "commentCharacterLimit": ${discussionTemplate.commentCharacterLimit},
                    "discussionTimeLimit": ${discussionTemplate.timeLimit},
                    "discussionIsPublic": ${discussionTemplate.isPublic},
                    "discussionIsInHuiFormat": ${discussionTemplate.isHui},
                    "discussionTopicCategories": "${categoryNames.join(', ')}",
                },
                "discussionComments": ${JSON.stringify(comments)},
                "discussionVerdicts" : ${JSON.stringify(verdicts)},
                "commentUserRatings": ${JSON.stringify(commentRatings)},
                "userInformation": ${JSON.stringify(users)},
            }`

        Email.send({
            to: exportingUserEmails.emails[0].address,
            from: "huriwhakatau@gmail.com",
            subject: "Exported data for: " + scenario.title,
            text: "Here's some data, don't spend it all in one place.",
            attachments: [{   // utf-8 string as an attachment
                filename: "Discussion-" + scenario.title + ".json",
                content: discussionData,
            }],
        });
    },

    // Remove an experiment from the experiments collection in the db.
    // experimentId: _id of the comment to be removed
    //
    "experiments.remove"(experimentId) {
        check(experimentId, String);
        //add role check

        Experiments.remove(experimentId);
    },

    //moving the group leader vote here so it can be experiment specific
    "experiments.voteLeader"(experimentId, groupId, userId) {
        Experiments.update(
            {_id: experimentId},
            {$inc: {["leaderVotes." + userId]: 1}},
            function (err, res) {
                let member;
                if (err) {
                    throw err;
                }
                let group = Groups.findOne({_id: groupId});
                let experiment = Experiments.findOne({_id: experimentId}, {fields: {leaderVotes: 1}})
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
                    Experiments.update({_id: experimentId}, {$set: {groupLeader: winner}});
                    console.log("winner is: ", winner);
                }
            }
        );
    },
});

if (Meteor.isServer) {
    // Experiments.remove({});

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
