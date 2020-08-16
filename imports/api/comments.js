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

  Meteor.publish("comments", function () {
    return Comments.find({ authorId: this.userId });
  });

  // List all the comments in the data base.
  console.log("List all comments\n", Comments.find({}).fetch());

  // List all the users in the database.
  console.log("List all users\n", Meteor.users.find({}).fetch());
}
