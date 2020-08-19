import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Comments = new Mongo.Collection("comments");

Meteor.methods({
  // Insert a comment into the comments collection in the db.
  // text: the text of the comment
  // discussionId: _id of the discussion this comment belongs to
  // Called from CommentForm.jsx
  "comments.insert"(text, discussionId) {
    check(text, String);
    check(discussionId, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Comments.insert({
      discussionId: discussionId,
      postedTime: new Date(),
      authorId: this.userId, // _id of user
      text: text,
    });
  },

  // Remove a comment from the comments collection in the db.
  // commentId: _id of the comment to be removed
  // Called from Discussion.jsx
  "comments.remove"(commentId) {
    check(commentId, String);

    const comment = Comments.findOne(commentId);

    // If user is not the author of the comment, throw error
    if (!this.userId || comment.authorId !== this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Comments.remove(commentId);
  },
});

if (Meteor.isServer) {
  // Comments.remove({});

  Meteor.publish("comments", function (discussionId) {
    return Comments.find({ discussionId: discussionId });
  });

  // List all the Comments and users in the db
  console.log("List all comments\n", Comments.find({}).fetch());
  console.log("List all users\n", Meteor.users.find({}).fetch());
}
