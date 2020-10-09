import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { Verdicts } from "./verdicts.js";

if (Meteor.isServer) {
  describe("Verdicts", function () {
    describe("methods", function () {
      const userId = Random.id();
      const randText = Random.secret();
      const randDiscussion = Random.id();

      // Set up a fake method call context.
      const invocation = { userId };
      let verdictId;

      // Remove all verdicts before and after all of the tests.
      before(function () {
        Verdicts.remove({});
      });
      after(function () {
        Verdicts.remove({});
      });

      // Test that a Verdict can be inserted.
      it("Insert verdict", function () {
        // Isolate internal method implementation.
        const insertVerdict = Meteor.server.method_handlers["verdicts.insert"];

        // Run the method with `this` set to the mock context.
        insertVerdict.apply(invocation, [randText, randDiscussion]);

        // Check its behavior.
        const verdict = Verdicts.find().fetch()[0];
        verdictId = verdict._id;
        performAssertions(verdict, randDiscussion, randText, userId, []);

        // Check number of documents in collection.
        assert.equal(Verdicts.find().count(), 1);
      });
    });
  });
}

function performAssertions(verdict, discussion, text, userId, votes) {
  assert.equal(verdict.discussionId, discussion);
  assert.equal(verdict.authorId, userId);
  assert.equal(verdict.text, text);
  assert.equal(verdict.votes.length, votes.length);
}
