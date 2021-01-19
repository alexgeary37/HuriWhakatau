import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Comments = new Mongo.Collection("comments");

Comments.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  discussionId: String,
  postedTime: Date,
  authorId: String,
  text: String,
  emojis: [Object],
  'emojis.$.count': SimpleSchema.Integer,
  'emojis.$.emoji': { type: Object, blackbox: true },
  'emojis.$.users': [String],
  
// 'keystrokes.$': type = {
//   key: event.key,
//   timestamp: Date.now(),
// }
  keystrokes: [Object],
  'keystrokes.$.key': String,
  'keystrokes.$.timestamp': Number,
  pastedItems: [Object],
  'pastedItems.$.item': String,
  'pastedItems.$.timestamp': Number,
  emotion: String,
  editedDate: { type: Date, optional: true, custom: function() {
    const previousEditsLength = this.field('previousEdits').length;
    if (previousEditsLength === 0) {
      this.value === null;
    }
  }},
  previousEdits: [String]
});

Meteor.methods({
  // Insert a comment into the comments collection in the db.
  // discussionId: _id of the discussion this comment belongs to
  // Called from CommentForm.jsx
  "comments.insert"(text, pasted, keystrokes, discussionId, emotion) {
    if (!emotion) {
      emotion = "neutral";
    }

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    comment = {
      discussionId: discussionId,
      postedTime: new Date(),
      authorId: this.userId,
      text: text,
      emojis: [],
      keystrokes: keystrokes,
      pastedItems: pasted,
      emotion: emotion,
      editedDate: null,
      previousEdits: []
    };

    // Check comment against schema.
    Comments.schema.validate(comment);

    Comments.insert(comment);
  },

  // Update an existing comment in the comments collection in the db.
  // text: the text of the comment
  // commentId: _id of the comment to be updated
  // Called from Discussion.jsx
  "comments.update"(text, commentId) {
    check(commentId, String);

    const comment = Comments.findOne(commentId);

    // If user is not the author of the comment, throw error.
    if (!this.userId || comment.authorId !== this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const mongoModifierObject = {
      $set: {
        text: text,
        editedDate: new Date(),
      },
      $push: { previousEdits: comment.text },
    };

    Comments.schema.validate(mongoModifierObject, { modifier: true });
    Comments.update(commentId, mongoModifierObject);
  },

  "comments.updateEmojis"(emojis, commentId) {
    check(commentId, String);

    const mongoModifierObject = {
      $set: {
        emojis: emojis,
      },
    };

    Comments.schema.validate(mongoModifierObject, { modifier: true });
    Comments.update(commentId, mongoModifierObject);
    return true;
  },

  //get a random comment from discussion.
  "comments.getRandomExperimentCommentForRating"(discussionIds) {
    if (Meteor.isServer) {
      const fetchedComment = Comments.rawCollection()
        .aggregate([
          { $match: { discussionId: { $in: discussionIds } } },
          { $sample: { size: 1 } },
        ])
        .toArray();
      return fetchedComment;
    }
  },

  // Remove a comment from the comments collection in the db.
  // commentId: _id of the comment to be removed
  // Called from Discussion.jsx
  "comments.remove"(commentId) {
    check(commentId, String);

    const comment = Comments.findOne(commentId);

    // If user is not the author of the comment, throw error.
    if (!this.userId || comment.authorId !== this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Comments.remove(commentId);
  },

  "comments.removeAll"() {
    Comments.remove({});
  },
});

if (Meteor.isServer) {
  Meteor.publish("comments", function (discussionId) {
    return Comments.find(
      { discussionId: discussionId },
    );
  });
}
