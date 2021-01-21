import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Verdicts } from "./verdicts";

export const Votes = new Mongo.Collection("votes");

Votes.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  userId: String,
  verdictId: String,
  vote: Boolean,
}).newContext();

Meteor.methods({
  // Insert a vote into the votes collection in the db.
  // Called from Verdict.jsx
  "votes.insert"(verdictId, userVote) {
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const vote = {
      userId: Meteor.userId(),
      verdictId: verdictId,
      vote: userVote,
    };

    // Check vote against schema.
    Votes.schema.validate(vote);

    if (Votes.schema.isValid()) {
      const voteId = Votes.insert(vote);

      // Add voteId to the list of votes this verdict contains.
      const mongoModifierObject = {
        $addToSet: {
          votes: voteId,
        },
      };

      Verdicts.schema.validate(mongoModifierObject, { modifier: true });

      if (Verdicts.schema.isValid()) {
        console.log('Successful validation of verdict update object for adding the vote to it');
        Verdicts.update(verdictId, mongoModifierObject);
      } else {
        console.log("validationErrors:", Verdicts.schema.validationErrors());
      }
    }
  },

  "votes.removeAll"() {
    Votes.remove({});
  },
});

if (Meteor.isServer) {
  Meteor.publish("votes", function (verdictId) {
    return Votes.find(
      { verdictId: verdictId },
      {
        fields: {
          userId: 1,
          verdictId: 1,
          vote: 1,
        },
      }
    );
  });
}
