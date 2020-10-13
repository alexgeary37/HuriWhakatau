import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { ScenarioSets } from "./scenarioSets";
import { Scenarios } from "./scenarios";
import { DiscussionTemplates } from "./discussionTemplate";
import { Discussions } from "./discussions";

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
    hasIntroduction
  ) {
    check(name, String);
    check(description, String);
    check(groupId, String);
    check(scenarioSetId, String);
    let discussionIds = [];
    //addcheck for user admin/researcher role

    const experimentId = Experiments.insert({
      name: name,
      description: description,
      groupId: groupId,
      scenarioSetId: scenarioSetId,
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
        $push: { discussions: introId },
      });
      console.log("adding intro id to set", introId);
      discussionIds.push(introId);
      console.log(discussionIds);
    }

    const set = ScenarioSets.findOne({ _id: scenarioSetId });
    const scenarios = Scenarios.find({ _id: { $in: set.scenarios } }).fetch();
    //for each scenario get discussion time limit and add to discussion
    for (i = 0; i < scenarios.length; i++) {
      console.log("creating discussion");
      const discussionTemplate = DiscussionTemplates.findOne({
        _id: scenarios[i].discussionTemplateId,
      });
      console.log("inserting discussion");
      const discussionId = Meteor.call(
        "discussions.insert",
        scenarios[i]._id,
        groupId,
        discussionTemplate.timeLimit,
        discussionTemplate.isHui,
      );
      console.log("adding discussion id to exp", discussionId);
      Experiments.update(experimentId, {
        $push: { discussions: discussionId },
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
        $set: { nextDiscussion: discussionIds[id + 1] },
      });
    }
  },

  // Remove an experiment from the experiments collection in the db.
  // experimentId: _id of the comment to be removed
  //
  "experiments.remove"(experimentId) {
    check(experimentId, String);
    //add role check

    Experiments.remove(experimentId);
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
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
