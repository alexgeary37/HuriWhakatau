import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const ScenarioSets = new Mongo.Collection("scenarioSets");

Meteor.methods({
  // Insert a Group into the scenariosets collection in the db.
  // Called from ...
  "scenarioSets.create"(title, description, scenarios) {
    check(title, String);
    check(description, String);
    check(scenarios, Array);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    // Insert new Group and get its _id.
    ScenarioSets.insert({
      title: title,
      description: description,
      scenarios: scenarios,
      createdAt: new Date(),
      createdBy: this.userId,
    });
  },
});

if (Meteor.isServer) {
  // ScenarioSets.remove({});

  Meteor.publish("scenarioSets", function () {
    return ScenarioSets.find();
  });
}
