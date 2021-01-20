import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const ScenarioSets = new Mongo.Collection("scenarioSets");

ScenarioSets.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  title: String,
  description: String,
  scenarios: [String],
  randomise: Boolean,
  createdAt: Date,
  createdBy: String
}).newContext();

Meteor.methods({
  // Insert a ScenarioSet into the scenariosets collection in the db.
  "scenarioSets.create"(title, description, scenarios, randomise) {
    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const scenarioSet = {
      title: title,
      description: description,
      scenarios: scenarios,
      randomise: randomise,
      createdAt: new Date(),
      createdBy: this.userId,
    };

    // Check scenarioSet against schema.
    ScenarioSets.schema.validate(scenarioSet);

    if (ScenarioSets.schema.isValid()) {
      console.log('Successful validation of scenarioSet');
      ScenarioSets.insert(scenarioSet);
    } else {
      console.log("validationErrors:", ScenarioSets.schema.validationErrors());
    }
  },

  "scenarioSets.removeAll"() {
    ScenarioSets.remove({});
  }
});

if (Meteor.isServer) {
  if(!process.env.MONGO_URL.includes("juryroom_admin")){
    console.log("minimongo ScenarioSets");
  } else {
    console.log("not minimongo ScenarioSets");
  }

  Meteor.publish("scenarioSets", function () {
    return ScenarioSets.find(
      {},
      {
        fields: {
          title: 1,
          description: 1,
          scenarios: 1,
          randomise: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
