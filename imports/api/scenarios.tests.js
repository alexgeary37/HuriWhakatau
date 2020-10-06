import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { Scenarios } from "./scenarios.js";

if (Meteor.isServer) {
  describe("Scenarios", function () {
    describe("methods", function () {
      const userId = Random.id();
      const randTitle = Random.secret();
      const randDescription = Random.secret();
      const randTopicId = Random.id();
      const randTemplate = Random.id();

      // Set up a fake method call context.
      const invocation = { userId };
      let scenarioId;

      // Remove all scenarios before and after all of the tests.
      before(function () {
        Scenarios.remove({});
      });
      after(function () {
        Scenarios.remove({});
      });

      // Test that a Scenario can be inserted.
      it("Create scenario", function () {
        // Isolate internal method implementation.
        const createScenario =
          Meteor.server.method_handlers["scenarios.create"];

        // Run the method with `this` set to the mock context.
        createScenario.apply(invocation, [
          randTitle,
          randDescription,
          randTopicId,
          randTemplate,
        ]);

        // Check its behavior.
        const scenario = Scenarios.find().fetch()[0];
        scenarioId = scenario._id;
        performAssertions(
          scenario,
          randTitle,
          randDescription,
          randTemplate,
          userId
        );

        // Check number of documents in collection.
        assert.equal(Scenarios.find().count(), 1);
      });
    });
  });
}

function performAssertions(scenario, title, description, template, userId) {
  assert.equal(scenario.title, title);
  assert.equal(scenario.description, description);
  assert.equal(scenario.discussionTemplateId, template);
  assert.equal(scenario.createdBy, userId);
}
