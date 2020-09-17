import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Scenarios = new Mongo.Collection("scenarios");

Meteor.methods({
  // Insert a Group into the scenarios collection in the db.
  // Called from ...
  //todo, work out how this can transition from existing data to new schema.
  "scenarios.create"(title, description, topicId, discussionTemplateId) {
    // topicId: String,
    // discussionTemplateId: String,
    console.log("Enter scenarios.create");

    check(title, String);
    check(description, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      console.log("Not authorized");
      throw new Meteor.Error("Not authorized.");
    }

    // Insert new Group and get its _id.
    Scenarios.insert({
      title: title,
      description: description,
      // topicId: topicId,
      discussionTemplateId: discussionTemplateId,
      createdAt: new Date(),
      createdBy: this.userId,
    });
  },
});

if (Meteor.isServer) {
  // Scenarios.remove({});

  Meteor.publish("scenarios", function () {
    return Scenarios.find(
      {},
      {
        fields: {
          title: 1,
          description: 1,
          topicId: 1,
          discussionTemplateId: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
