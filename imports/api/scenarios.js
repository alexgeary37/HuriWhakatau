import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Scenarios = new Mongo.Collection("scenarios");

Meteor.methods({
  // Insert a Scenario into the scenarios collection in the db.
  // Called from ...
  //todo, work out how this can transition from existing data to new schema.
  "scenarios.create"(title, description, categoryIds, discussionTemplateId) {
    check(title, String);
    check(description, String);
    check(categoryIds, Array);
    check(discussionTemplateId, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      console.log("Not authorized");
      throw new Meteor.Error("Not authorized.");
    }

    // Insert new Group and get its _id.
    const scenarioId = Scenarios.insert({
      title: title,
      description: description,
      categoryIds: categoryIds,
      discussionTemplateId: discussionTemplateId,
      createdAt: new Date(),
      createdBy: this.userId,
    });
    return scenarioId;
  },
});

if (Meteor.isServer) {
  Scenarios.remove({});

  const scenarios = Scenarios.find({}).fetch();
  for (i = 0; i < scenarios.length; i += 1) {
    console.log(i, '\n', scenarios[i]);
  }

  Meteor.publish("scenarios", function () {
    return Scenarios.find(
      {},
      {
        fields: {
          title: 1,
          description: 1,
          categoryIds: 1,
          discussionTemplateId: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
