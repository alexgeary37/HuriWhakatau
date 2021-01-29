import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";
import { Discussions } from "./discussions";

export const Verdicts = new Mongo.Collection("verdicts");

Verdicts.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  discussionId: String,
  postedTime:  Date,
  authorId: String,
  text: String,
  votes: [Object],
  'votes.$.userId': String,
  'votes.$.vote': Boolean,
  'votes.$.voteTime': Date
}).newContext();

Meteor.methods({

  // Insert a Verdict into the verdicts collection in the db.
  // Called from VerdictForm.jsx
  "verdicts.insert"(text, discussionId) {
    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const verdict = {
      discussionId: discussionId,
      postedTime: new Date(),
      authorId: Meteor.userId(), // _id of user.
      text: text,
      votes: [] // _ids of votes that all OTHER users have given.
    };

    // Check verdict against schema.
    Verdicts.schema.validate(verdict);

    if (Verdicts.schema.isValid()) {
      console.log('Successful validation of verdict');
      const verdictId = Verdicts.insert(verdict);
      
      // Add _id of inserted Verdict and the author of it.

      let mongoModifierObject = {
        $addToSet: {
          verdicts: verdictId,
        },
      };

      Discussions.schema.validate(mongoModifierObject, { modifier: true });

      if (Discussions.schema.isValid()) {
        console.log('Successful validation of discussion update object in verdicts.insert when adding verdict to list of discussion verdicts');
        Discussions.update(discussionId, mongoModifierObject);
        
        // Remove this user from the list of activeVerdictProposers in the Discussion.
        // Meteor.call("discussions.removeProposer", discussionId);
        // This method call is being made from the server, which means the userId will be null for unit tests.
        // Hence the code below is being used instead.

        mongoModifierObject = {
          $pull: { activeVerdictProposers: Meteor.userId() },
        };

        Discussions.schema.validate(mongoModifierObject, { modifier: true });

        if (Discussions.schema.isValid()) {
          console.log('Successful validation of discussion update object in verdicts.insert when removing user from the discussion activeVerdictProposers');
          Discussions.update(discussionId, mongoModifierObject);
        } else {
          console.log("validationErrors:", Discussions.schema.validationErrors());
        }
      } else {
        console.log("validationErrors:", Discussions.schema.validationErrors());
      }
    } else {
      console.log("validationErrors:", Verdicts.schema.validationErrors());
    }
  },

  "verdicts.addVote"(verdictId, vote) {
    check(verdictId, String);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const mongoModifierObject = {
      $addToSet: {
        votes: { userId: Meteor.userId(), vote: vote, voteTime: new Date() },
      },
    };

    Verdicts.schema.validate(mongoModifierObject, { modifier: true });

    if (Verdicts.schema.isValid()) {
      console.log('Successful validation of verdict update object for adding a vote');
      Verdicts.update(verdictId, mongoModifierObject);
    } else {
      console.log("validationErrors:", Verdicts.schema.validationErrors());
    }
  },

  "verdicts.removeAll"() {
    Verdicts.remove({});
    console.log('Verdicts.count():', Verdicts.find().count());
  }
});

if (Meteor.isServer) {
  Meteor.publish("verdicts", function (discussionId) {
    return Verdicts.find(
      { discussionId: discussionId },
      {
        fields: {
          discussionId: 1,
          postedTime: 1,
          authorId: 1,
          text: 1,
          votes: 1,
        },
      }
    );
  });
}
