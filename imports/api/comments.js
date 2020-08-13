import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Comments = new Mongo.Collection("comments");

Meteor.methods({
  "comments.insert"(text) {
    check(text, String);

    // I believe this means it's checking that the user is the client currently calling this method
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Comments.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },

  "comments.remove"(commentId) {
    check(commentId, String);

    const comment = Comments.findOne(commentId);

    if (!this.userId || comment.owner !== this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Comments.remove(commentId);
  },
});

if (Meteor.isServer) {
  Meteor.publish("comments", function () {
    return Comments.find({
      $or: [{ private: { $ne: true } }, { owner: this.userId }],
    });
  });
}
