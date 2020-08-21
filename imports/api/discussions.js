import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Discussions = new Mongo.Collection("discussions");

Meteor.methods({
  // Insert a discussion into the discussions collection in the db.
  // Called from Dashboardjsx
  "discussions.insert"(scenarioId, groupId) {
    check(scenarioId, String);
    check(groupId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Discussions.insert({
      scenarioId: scenarioId,
      groupId: groupId,
      createdAt: new Date(),
      createdBy: this.userId,
      activeVerdictProposers: [], // Contains the users currently proposing a verdict.
      verdicts: [], // List of verdict._ids in this discussion.
    });
  },

  // Add a user to the list of activeVerdictProposers in the specified Discussion.
  // Called from Discussion.jsx
  "discussions.addProposer"(discussionId) {
    check(discussionId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Discussions.update(discussionId, {
      $addToSet: { activeVerdictProposers: this.userId },
    });
  },

  // Remove a user from the list of activeVerdictProposers in the specified Discussion.
  // Called from VerdictForm.jsx
  "discussions.removeProposer"(discussionId) {
    check(discussionId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Discussions.update(discussionId, {
      $pull: { activeVerdictProposers: this.userId },
    });
  },
});

if (Meteor.isServer) {
  // Discussions.remove({});

  Meteor.publish("discussions", function () {
    return Discussions.find();
  });
}
