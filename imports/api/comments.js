import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Comments = new Mongo.Collection("comments");

Meteor.methods({
  // Insert a comment into the comments collection in the db.
  // text: the text of the comment
  // discussionId: _id of the discussion this comment belongs to
  // Called from CommentForm.jsx
  "comments.insert"(text, pasted, keystrokes, discussionId, emotion) {
    check(text, String);
    check(pasted, Array);
    check(keystrokes, Array);
    check(discussionId, String);
    if(!emotion){emotion = 'neutral'}
    check(emotion, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Comments.insert({
      discussionId: discussionId,
      postedTime: new Date(),
      authorId: this.userId, // _id of user
      text: text,
      emojis: [],
      keystrokes: keystrokes,
      pastedItems: pasted,
      emotion: emotion,
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

  // Update an existing comment in the comments collection in the db.
  // text: the text of the comment
  // commentId: _id of the comment to be updated
  // Called from Discussion.jsx
  "comments.update"(text, commentId) {
    check(commentId, String);
    const comment = Comments.findOne(commentId);

    // If user is not the author of the comment, throw error
    if (!this.userId || comment.authorId !== this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Comments.update(commentId, {
      $set: {
        text: text,
        editedDate: new Date(),
      },
      $push: { previousEdits: comment.text },
    });
  },

  "comments.updateEmojis"(emojis, commentId) {
    check(commentId, String);
    check(emojis, Array);

    Comments.update(commentId, {
      $set: {
        emojis: emojis,
      },
    });
    return true;
  },

  //get a random comment from discussion
  "comments.getRandomExperimentCommentForRating"(discussionIds) {
    if (Meteor.isServer) {
      const fetchedComment = Comments.rawCollection().aggregate([
        {$match: {discussionId: {$in: discussionIds}}},
        {$sample: {size: 1}}
      ])
          .toArray();
      return fetchedComment;
    }
  },
});

if (Meteor.isServer) {
  Meteor.publish("comments", function (discussionId) {
    return Comments.find(
      { discussionId: discussionId },
      {
        fields: {
          postedTime: 1,
          authorId: 1,
          text: 1,
          emojis: 1,
          keystrokes: 1,
          pasted: 1,
          editedDate: 1,
          emotion: 1,
        },
      }
    );
  });
}
