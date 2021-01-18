import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Discussions = new Mongo.Collection("discussions");

Discussions.schema = new SimpleSchema({
  scenarioId: String,
  groupId: String,
  createdAt: Date,
  createdBy: String,
  activeVerdictProposers: [String],
  verdicts: [String],
  status: String,
  timeLimit: Number,
  deadline: {type: Date, defaultValue: null},
  isIntroduction: {type: Boolean, defaultValue: false},
  isHui: Boolean,
  isPublic: Boolean
});

Meteor.methods({
  // Insert a discussion into the discussions collection in the db.
  // Called from experiments.js
  "discussions.insert"(scenarioId, groupId, timeLimit, isHui, isPublic) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const discussion = {
      scenarioId: scenarioId,
      groupId: groupId,
      createdAt: new Date(),
      createdBy: this.userId,
      activeVerdictProposers: [], // Contains the users currently proposing a verdict.
      verdicts: [], // List of verdict._ids in this discussion.
      status: "active",
      timeLimit: timeLimit,
      deadline: null, //to be set when discussion started and based on start datetime + timelimit from discussion template
      isIntroduction: false,
      isHui: isHui,
      isPublic: isPublic,
    };

    // Check discussion against schema.
    Discussions.schema.validate(discussion);

    const discussionId = Discussions.insert(discussion);

    return discussionId;
  },

  // Insert an introduction type discussion into the discussions collection in the db.
  // Called from experiments.js
  "discussions.insertIntroduction"(scenarioId, groupId, timeLimit) {
    check(scenarioId, String);
    check(groupId, String);
    check(timeLimit, Number);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const discussionId = Discussions.insert({
      scenarioId: scenarioId,
      groupId: groupId,
      createdAt: new Date(),
      createdBy: this.userId,
      activeVerdictProposers: [], // Contains the users currently proposing a verdict.
      verdicts: [], // List of verdict._ids in this discussion.
      status: "active",
      timeLimit: timeLimit,
      deadline: null, //to be set when discussion started and based on start datetime + timelimit from discussion template
      isIntroduction: true,
      isHui: true,
      isPublic: false,
    });

    return discussionId;
  },

  "discussions.updateDeadline"(discussionId, deadline) {
    check(discussionId, String);

    Discussions.update(discussionId, {
      $set: { deadline: deadline },
    });
  },

  "discussions.updateDeadlineTimeout"(discussionId) {
    check(discussionId, String);

    Discussions.update(discussionId, {
      $set: {
        deadline: null,
        timeLimit: 0,
      },
    });
  },

  "discussions.updateStatus"(discussionId, status) {
    check(discussionId, String);

    Discussions.update(discussionId, {
      $set: { status: status },
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

    console.log("discussions.removeProposer::", this.userId);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Discussions.update(discussionId, {
      $pull: { activeVerdictProposers: this.userId },
    });
  },

  "discussions.addUserToTypingList"(discussionId, username) {
    Discussions.update(
      {
        _id: discussionId,
        $or: [
          { usersTyping: { $size: 0 } },
          {
            $nor: [
              { usersTyping: { $elemMatch: { user: { $eq: username } } } },
            ],
          },
        ],
      },
      {
        $addToSet: { usersTyping: { user: username, timestamp: Date.now() } },
      }
    );

    Meteor.setTimeout(() => {
      let datetimeThreshold = Date.now() - 1000;
      Discussions.update(
        { _id: discussionId },
        {
          $pull: {
            usersTyping: {
              user: username,
              timestamp: { $lt: datetimeThreshold },
            },
          },
        }
      );
    }, 2000);
  },

  "discussions.removeAll"() {
    Discussions.remove({});
  },
});

if (Meteor.isServer) {
  if (!process.env.MONGO_URL.includes("juryroom_admin")) {
    console.log("minimongo discussions", process.env.MONGO_URL);
  } else {
    console.log("not minimongo discussions");
  }

  Meteor.publish("allDiscussions", function () {
    return Discussions.find(
      {},
      {
        fields: {
          scenarioId: 1,
          groupId: 1,
          createdAt: 1,
          createdBy: 1,
          activeVerdictProposers: 1,
          verdicts: 1,
          status: 1,
          maxCommentLength: 1,
          deadline: 1,
          isIntroduction: 1,
          isHui: 1,
          isPublic: 1,
          usersTyping: 1,
          nextDiscussion: 1,
        },
      }
    );
  });

  Meteor.publish("discussions", function (discussionId) {
    return Discussions.find(
      { _id: discussionId },
      {
        fields: {
          scenarioId: 1,
          groupId: 1,
          createdAt: 1,
          createdBy: 1,
          activeVerdictProposers: 1,
          verdicts: 1,
          status: 1,
          maxCommentLength: 1,
          deadline: 1,
          isIntroduction: 1,
          nextDiscussion: 1,
          timeLimit: 1,
          isPublic: 1,
          isHui: 1,
          usersTyping: 1,
        },
      }
    );
  });
}
