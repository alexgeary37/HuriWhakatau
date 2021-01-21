import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Scenarios = new Mongo.Collection("scenarios");

Scenarios.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  title: String,
  description: String,
  categoryIds: [String],
  discussionTemplateId: String,
  createdAt: Date,
  createdBy: String
}).newContext();

Meteor.methods({
  // Insert a Scenario into the scenarios collection in the db.
  //todo, work out how this can transition from existing data to new schema.
  "scenarios.create"(title, description, categoryIds, discussionTemplateId) {

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      console.log("Not authorized");
      throw new Meteor.Error("Not authorized.");
    }

    const scenario = {
      title: title,
      description: description,
      categoryIds: categoryIds,
      discussionTemplateId: discussionTemplateId,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    };

    // Check scenario against schema.
    Scenarios.schema.validate(scenario);

    // Insert new Scenario and get its _id.
    if (Scenarios.schema.isValid()) {
      console.log('Successful validation of scenario');
      const scenarioId = Scenarios.insert(scenario);
      return scenarioId;
    } else {
      console.log("validationErrors:", Scenarios.schema.validationErrors());
    }
  },

  "scenarios.removeAll"() {
    Scenarios.remove({});
  }
});

if (Meteor.isServer) {
  if(!process.env.MONGO_URL.includes("juryroom_admin")){
    console.log("minimongo Scenarios");
  } else {
    console.log("not minimongo Scenarios");
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
