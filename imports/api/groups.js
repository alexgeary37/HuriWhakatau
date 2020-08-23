import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { Scenarios } from "/imports/api/scenarios";

export const Groups = new Mongo.Collection("groups");

Meteor.methods({
  // Insert a Group into the groups collection in the db.
  // members: _ids of the users in this group
  // discussions: _ids of the discussions this Group will discuss
  // Called from CreateGroup.jsx
  "groups.create"(name, members, scenarioSet) {
    check(name, String);
    check(members, Array);
    check(scenarioSet, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const groupId = Groups.insert({
      name: name,
      members: members,
      scenarioSet: scenarioSet,
      createdAt: new Date(),
      createdBy: this.userId,
    });

    const set = ScenarioSets.findOne({ _id: scenarioSet });
    const scenarios = Scenarios.find({ _id: { $in: set.scenarios } }).fetch();

    for (i = 0; i < scenarios.length; i++) {
      Meteor.call("discussions.insert", scenarios[i]._id, groupId);
    }
  },
});

if (Meteor.isServer) {
  // Groups.remove({}); //

  Meteor.publish("groups", function (userId) {
    return Groups.find(
      {},
      {
        fields: {
          name: 1,
          members: 1,
          scenarioSet: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
