import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const ScenarioSets = new Mongo.Collection("scenarioSets");

Meteor.methods({
  // Insert a ScenarioSet into the scenariosets collection in the db.
  // Called from ...
  "scenarioSets.create"(title, description, scenarios, randomise) {
    check(title, String);
    check(description, String);
    check(scenarios, Array);
    check(randomise, Boolean);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    // Insert new ScenarioSet
    ScenarioSets.insert({
      title: title,
      description: description,
      scenarios: scenarios,
      randomise: randomise,
      createdAt: new Date(),
      createdBy: this.userId,
    });
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
