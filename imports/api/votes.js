import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Votes = new Mongo.Collection("votes");

Meteor.methods({
  // Insert a vote into the votes collection in the db.
  // userId: _id of the user that made this vote
  // verdictId: _id of the verdict this vote was made on
  // vote: True if user Affirmed, False if user Rejected
  // Called from CommentForm.jsx
  "votes.insert"(userId, verdictId, vote) {
    check(userId, String);
    check(verdictId, String);
    check(vote, Boolean);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Votes.insert({
      userId: userId,
      verdictId: verdictId,
      vote: vote,
    });

    console.log("Vote inserted");
  },
});

if (Meteor.isServer) {
  // Votes.remove({});

  Meteor.publish("votes", function () {
    return Votes.find();
  });

  // List all the Votes in the db.
  console.log("List all votes\n", Votes.find({}).fetch());
}
