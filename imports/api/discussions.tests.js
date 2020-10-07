import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { Discussions } from "./discussions.js";

if (Meteor.isServer) {
  describe("Discussions", function () {
    describe("methods", function () {
      const userId = Random.id();
      const randScenarioId = Random.id();
      const randGroupId = Random.id();
      const randTimeLimit = Math.floor(Math.random() * 100);

      // Set up a fake method call context.
      const invocation = { userId };
      let discussionId;

      // Remove all discussions before and after all of the tests.
      before(function () {
        Discussions.remove({});
      });
      after(function () {
        Discussions.remove({});
      });

      // Test that a discussion can be inserted.
      it("Insert discussion", function () {
        // Isolate internal method implementation.
        const insertDiscussion =
          Meteor.server.method_handlers["discussions.insert"];

        // Run the method with `this` set to the mock context.
        insertDiscussion.apply(invocation, [
          randScenarioId,
          randGroupId,
          randTimeLimit,
        ]);

        // Check its behavior.
        const discussion = Discussions.find().fetch()[0];
        discussionId = discussion._id;
        performAssertions(
          discussion,
          randScenarioId,
          randGroupId,
          userId,
          [],
          [],
          "active",
          randTimeLimit,
          null,
          false
        );

        // Check number of documents in collection.
        assert.equal(Discussions.find().count(), 1);
      });

      const deadline = new Date().getTime() + randTimeLimit * 60000;

      // Test that the discussion's deadline can be updated.
      it("Update discussion deadline", function () {
        const updateDeadline =
          Meteor.server.method_handlers["discussions.updateDeadline"];
        updateDeadline.apply(invocation, [discussionId, deadline]);
        const discussion = Discussions.findOne({ _id: discussionId });
        performAssertions(
          discussion,
          randScenarioId,
          randGroupId,
          userId,
          [],
          [],
          "active",
          randTimeLimit,
          deadline,
          false
        );
        assert.equal(Discussions.find().count(), 1);
      });

      const status = "timedout";

      // Test that the discussion's status can be updated.
      it("Update discussion status", function () {
        const updateStatus =
          Meteor.server.method_handlers["discussions.updateStatus"];
        updateStatus.apply(invocation, [discussionId, status]);
        const discussion = Discussions.findOne({ _id: discussionId });
        performAssertions(
          discussion,
          randScenarioId,
          randGroupId,
          userId,
          [],
          [],
          status,
          randTimeLimit,
          deadline,
          false
        );
        assert.equal(Discussions.find().count(), 1);
      });

      // Test that the current user can be added to the active verdict proposers.
      it("Add proposers", function () {
        const addProposer =
          Meteor.server.method_handlers["discussions.addProposer"];
        addProposer.apply(invocation, [discussionId]);
        const discussion = Discussions.findOne({ _id: discussionId });
        performAssertions(
          discussion,
          randScenarioId,
          randGroupId,
          userId,
          [userId],
          [],
          status,
          randTimeLimit,
          deadline,
          false
        );
        assert.equal(Discussions.find().count(), 1);
      });

      // Test that the current user can be removed from active verdict proposers.
      it("Remove proposer", function () {
        const removeProposer =
          Meteor.server.method_handlers["discussions.removeProposer"];
        removeProposer.apply(invocation, [discussionId]);
        const discussion = Discussions.findOne({ _id: discussionId });
        performAssertions(
          discussion,
          randScenarioId,
          randGroupId,
          userId,
          [],
          [],
          status,
          randTimeLimit,
          deadline,
          false
        );
        assert.equal(Discussions.find().count(), 1);
      });
    });
  });
}

function performAssertions(
  discussion,
  randScenarioId,
  randGroupId,
  userId,
  activeVerdictProposers,
  verdicts,
  status,
  randTimeLimit,
  deadline,
  isIntro
) {
  assert.equal(discussion.scenarioId, randScenarioId);
  assert.equal(discussion.groupId, randGroupId);
  assert.equal(discussion.createdBy, userId);
  assert.equal(
    discussion.activeVerdictProposers.length,
    activeVerdictProposers.length
  );
  for (i = 0; i < activeVerdictProposers.length; i++) {
    assert.equal(
      discussion.activeVerdictProposers[i],
      activeVerdictProposers[i]
    );
  }
  assert.equal(discussion.verdicts.length, verdicts.length);
  for (i = 0; i < verdicts.length; i++) {
    assert.equal(discussion.verdicts[i], verdicts[i]);
  }
  assert.equal(discussion.status, status);
  assert.equal(discussion.timeLimit, randTimeLimit);
  assert.equal(discussion.deadline, deadline);
  assert.equal(discussion.isIntroduction, isIntro);
}
