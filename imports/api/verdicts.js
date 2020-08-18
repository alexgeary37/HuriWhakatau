import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Verdicts = new Mongo.Collection("verdicts");

Meteor.methods({
  // Insert a verdict into the verdicts collection in the db.
  // text: the text of the verdict
  // discussionId: _id of the discussion this verdict belongs to
  // Called from VerdictForm.jsx
  "verdicts.insert"(text, discussionId) {
    check(text, String);
    check(discussionId, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Verdicts.insert({
      discussionId: discussionId,
      postedTime: new Date(),
      authorId: this.userId, // _id of user
      text: text,
    });
  },
});

if (Meteor.isServer) {
  // Verdicts.remove({});

  Meteor.publish("verdicts", function (discussionId) {
    return Verdicts.find({ discussionId: discussionId });
  });

  // List all the verdicts and users in the db
  console.log("List all verdicts\n", Verdicts.find({}).fetch());
}
