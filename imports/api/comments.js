import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Comments = new Mongo.Collection("comments");

Meteor.methods({
  // Insert a comment into the comments collection in the db.
  // text: the text of the comment
  // Called from CommentForm.jsx
  "comments.insert"(text) {
    check(text, String);

    // I believe this means it's checking that the user is the client currently calling this method.
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

  // Remove a comment from the comments collection in the db.
  // commentId: the
  // Called from App.jsx
  "comments.remove"(commentId) {
    check(commentId, String);

    const comment = Comments.findOne(commentId);

    // If user is not the owner of the comment, throw error
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
