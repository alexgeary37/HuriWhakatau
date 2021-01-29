import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Discussions = new Mongo.Collection("discussions");

Discussions.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  scenarioId: String,
  groupId: String,
  createdAt: Date,
  createdBy: String,
  activeVerdictProposers: [String],
  verdicts: [String],
  status: String,
  timeLimit: Number,
  consensusThreshold: SimpleSchema.Integer,
  deadline: {
    type: Date,
    optional: true,
    custom: function () {
      this.value === null;
    }
  },
  usersTyping: [Object],
  'usersTyping.$.user': String,
  'usersTyping.$.timestamp': Number,
  isIntroduction: { type: Boolean, defaultValue: false },
  isHui: Boolean,
  isPublic: Boolean,
  nextDiscussion: {
    type: String,
    optional: true,
    custom: function () {
      this.value === null;
    }
  }
}).newContext();

Meteor.methods({
  // Insert a discussion into the discussions collection in the db.
  // Called from experiments.js
  "discussions.insert"(scenarioId, groupId, timeLimit, consensusThreshold, isHui, isPublic) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const discussion = {
      scenarioId: scenarioId,
      groupId: groupId,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      activeVerdictProposers: [], // Contains the users currently proposing a verdict.
      verdicts: [], // List of verdict._ids in this discussion.
      status: "active",
      timeLimit: timeLimit,
      consensusThreshold: consensusThreshold,
      deadline: null, //to be set when discussion started and based on start datetime + timelimit from discussion template
      usersTyping: [],
      isIntroduction: false,
      isHui: isHui,
      isPublic: isPublic,
      nextDiscussion: null
    };

    // Check discussion against schema.
    Discussions.schema.validate(discussion);
    
    if (Discussions.schema.isValid()) {
      console.log('Successful validation');
      return Discussions.insert(discussion); // discussion._id is returned.
    }

    console.log("validationErrors:", Discussions.schema.validationErrors());
  },

  // Insert an introduction type discussion into the discussions collection in the db.
  // Called from experiments.js
  "discussions.insertIntroduction"(scenarioId, groupId, timeLimit, consensusThreshold) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const discussion = {
      scenarioId: scenarioId,
      groupId: groupId,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      activeVerdictProposers: [], // Contains the users currently proposing a verdict.
      verdicts: [], // List of verdict._ids in this discussion.
      status: "active",
      timeLimit: timeLimit,
      consensusThreshold: consensusThreshold,
      deadline: null, //to be set when discussion started and based on start datetime + timelimit from discussion template
      usersTyping: [],
      isIntroduction: true,
      isHui: true,
      isPublic: false,
      nextDiscussion: null
    };

    Discussions.schema.validate(discussion);
    
    if (Discussions.schema.isValid()) {
      console.log("Successful validation");
      return Discussions.insert(discussion); // discussion._id is returned.
    }
    
    console.log("validationErrors:", Discussions.schema.validationErrors());
  },

  "discussions.updateDeadline"(discussionId, deadline) {
    check(discussionId, String);

    const mongoModifierObject = {
      $set: { deadline: deadline },
    };

    Discussions.schema.validate(mongoModifierObject, { modifier: true });
    
    if (Discussions.schema.isValid()) {
      console.log("Successful validation");
      Discussions.update(discussionId, mongoModifierObject);
    } else {
      console.log("validationErrors:", Discussions.schema.validationErrors());
    }
  },

  "discussions.updateDeadlineTimeout"(discussionId) {
    check(discussionId, String);

    const mongoModifierObject = {
      $set: {
        deadline: null,
        timeLimit: 0,
      },
    };

    Discussions.schema.validate(mongoModifierObject, { modifier: true });
    
    if (Discussions.schema.isValid()) {
      console.log("Successful validation");
      Discussions.update(discussionId, mongoModifierObject);
    } else {
      console.log("validationErrors:", Discussions.schema.validationErrors());
    }
  },

  "discussions.updateStatus"(discussionId, status) {
    check(discussionId, String);

    const mongoModifierObject = {
      $set: { status: status },
    };

    Discussions.schema.validate(mongoModifierObject, { modifier: true });
    
    if (Discussions.schema.isValid()) {
      console.log("Successful validation");
      Discussions.update(discussionId, mongoModifierObject);
    } else {
      console.log("validationErrors:", Discussions.schema.validationErrors()); 
    }
  },

  // Add a user to the list of activeVerdictProposers in the specified Discussion.
  // Called from Discussion.jsx
  "discussions.addProposer"(discussionId) {
    check(discussionId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const mongoModifierObject = {
      $addToSet: { activeVerdictProposers: Meteor.userId() },
    };

    Discussions.schema.validate(mongoModifierObject, { modifier: true });
    
    if (Discussions.schema.isValid()) {
      console.log("Successful validation");
      Discussions.update(discussionId, mongoModifierObject);
    } else {
      console.log("validationErrors:", Discussions.schema.validationErrors());
    }
  },

  // Remove a user from the list of activeVerdictProposers in the specified Discussion.
  // Called from VerdictForm.jsx
  "discussions.removeProposer"(discussionId) {
    check(discussionId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const mongoModifierObject = {
      $pull: { activeVerdictProposers: Meteor.userId() },
    };

    Discussions.schema.validate(mongoModifierObject, { modifier: true });

    if (Discussions.schema.isValid()) {
      console.log("Successful validation");
      Discussions.update(discussionId, mongoModifierObject);
    } else {
      console.log("validationErrors:", Discussions.schema.validationErrors());
    }
  },

  "discussions.addUserToTypingList"(discussionId, username) {
    check(discussionId, String);

    let mongoModifierObject = {
      $addToSet: { usersTyping: { user: username, timestamp: Date.now() } },
    };

    Discussions.schema.validate(mongoModifierObject, { modifier: true });

    if (Discussions.schema.isValid()) {
      console.log("Successful validation");
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
        mongoModifierObject
      );

      if (Meteor.isServer) {
        Meteor.setTimeout(() => {
          let datetimeThreshold = Date.now() - 1000;
    
          mongoModifierObject = {
            $pull: {
              usersTyping: {
                user: username,
                timestamp: { $lt: datetimeThreshold },
              },
            },
          };
    
          Discussions.schema.validate(mongoModifierObject, { modifier: true });
  
          if (Discussions.schema.isValid()) {
            console.log("Successful validation");
            Discussions.update(discussionId, mongoModifierObject);
          } else {
            console.log("validationErrors:", Discussions.schema.validationErrors());
          }
        }, 2000);
      }
    } else {
      console.log("validationErrors:", Discussions.schema.validationErrors());
    }
  },

  "discussions.removeAll"() {
    Discussions.remove({});
    console.log('Discussions.count():', Discussions.find().count());
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
          nextDiscussion: 1,
          timeLimit: 1,
          consensusThreshold: 1,
          isHui: 1,
          isPublic: 1,
          usersTyping: 1,
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
          consensusThreshold: 1,
          isHui: 1,
          isPublic: 1,
          usersTyping: 1,
        },
      }
    );
  });
}
