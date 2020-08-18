import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Discussions = new Mongo.Collection("discussions");

//
Meteor.methods({
  // Insert a discussion into the discussions collection in the db.
  // Called from Dashboardjsx
  "discussions.insert"(title, description) {
    check(title, String);
    check(description, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Discussions.insert({
      title: title,
      description: description,
      createdAt: new Date(),
      createdBy: this.userId,
      activeVerdictProposers: [], // Contains the users currently proposing a verdict.
      verdicts: [], // Verdicts in this discussion.
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

  // Add the specified Verdict to the internal list of verdicts in the specified Discussion.
  // Called from VerdictForm.jsx
  "discussions.addVerdict"(discussionId, verdict) {
    Discussions.update(discussionId, {
      $addToSet: { verdicts: verdict },
    });
  },
});

if (Meteor.isServer) {
  // Discussions.remove({});

  Meteor.publish("discussions", function () {
    return Discussions.find();
  });

  // List all the Discussions in the data base.
  console.log("List all discussions\n", Discussions.find({}).fetch());
}
