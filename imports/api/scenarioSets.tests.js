import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { ScenarioSets } from "./scenarioSets.js";

if (Meteor.isServer) {
  describe("ScenarioSets", function () {
    describe("methods", function () {
      const userId = Random.id();
      const randTitle = Random.secret();
      const randDescription = Random.secret();
      const randScenarios = [Random.id(), Random.id(), Random.id()];
      const randomise = Random.choice([true, false]);

      // Set up a fake method call context.
      const invocation = { userId };
      let scenarioSetId;

      // Remove all scenarioSets before and after all of the tests.
      before(function () {
        ScenarioSets.remove({});
      });
      after(function () {
        ScenarioSets.remove({});
      });

      // Test that a ScenarioSet can be inserted.
      it("Create scenarioSet", function () {
        // Isolate internal method implementation.
        const createScenarioSet =
          Meteor.server.method_handlers["scenarioSets.create"];

        // Run the method with `this` set to the mock context.
        createScenarioSet.apply(invocation, [
          randTitle,
          randDescription,
          randScenarios,
          randomise,
        ]);

        // Check its behavior.
        const scenarioSet = ScenarioSets.find().fetch()[0];
        scenarioSetId = scenarioSet._id;
        performAssertions(
          scenarioSet,
          randTitle,
          randDescription,
          randScenarios,
          randomise,
          userId
        );

        // Check number of documents in collection.
        assert.equal(ScenarioSets.find().count(), 1);
      });
    });
  });
}

function performAssertions(
  scenarioSet,
  title,
  description,
  scenarios,
  randomise,
  userId
) {
  assert.equal(scenarioSet.title, title);
  assert.equal(scenarioSet.description, description);
  assert.equal(scenarioSet.scenarios.length, scenarios.length);
  for (i = 0; i < scenarios.length; i++) {
    assert.equal(scenarioSet.scenarios[i], scenarios[i]);
  }
  assert.equal(scenarioSet.randomise, randomise);
  assert.equal(scenarioSet.createdBy, userId);
}
