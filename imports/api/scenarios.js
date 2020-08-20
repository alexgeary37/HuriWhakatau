import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Scenarios = new Mongo.Collection("scenarios");

Meteor.methods({
  // Insert a Group into the scenarios collection in the db.
  // Called from ...
  "scenarios.create"(title, description) {
    check(title, String);
    check(description, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    // Insert new Group and get its _id.
    Scenarios.insert({
      title: title,
      description: description,
      createdAt: new Date(),
      createdBy: this.userId,
    });
  },
});

if (Meteor.isServer) {
  // Scenarios.remove({});

  Meteor.publish("scenarios", function () {
    return Scenarios.find();
  });

  // List all the Scenarios in the db
  // console.log("List all scenarios\n", Scenarios.find().fetch());
}
