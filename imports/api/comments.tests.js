import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { Comments } from "./comments.js";

if (Meteor.isServer) {
  describe("Comments", function () {
    describe("methods", function () {
      const userId = Random.id();
      const randText = "Test comment";
      const randPasted = [];
      const randKeystrokes = [];
      const randDiscussionId = Random.id();
      const updatedText = "Updated text";
      const invocation = { userId }; // Set up a fake method call context.
      let commentId;

      // Remove all comments before and after all of the tests.
      before(function () {
        Comments.remove({});
      });
      after(function () {
        Comments.remove({});
      });

      // Test that a comment can be inserted.
      it("Insert own comment", function () {
        // Isolate internal method implementation.
        const insertComment = Meteor.server.method_handlers["comments.insert"];

        // Run the method with `this` set to the mock context.
        insertComment.apply(invocation, [
          randText,
          randPasted,
          randKeystrokes,
          randDiscussionId,
        ]);

        // Check its behaviour.
        const comment = Comments.find().fetch()[0];
        commentId = comment._id;
        performAssertions(comment, randText, randDiscussionId, userId, []);

        // Check number of documents in collection.
        assert.equal(Comments.find().count(), 1);
      });

      // Test that a comment's text can be updated.
      it("Update own comment", function () {
        const updateComment = Meteor.server.method_handlers["comments.update"];
        updateComment.apply(invocation, [updatedText, commentId]);
        const comment = Comments.findOne({ _id: commentId });
        performAssertions(comment, updatedText, randDiscussionId, userId, []);
        assert.equal(Comments.find().count(), 1);
      });

      const updatedEmojis = [5, 6, 7, 4];

      // Test that a comment's emojis can be updated.
      it("Update own comment's emojis", function () {
        const updateEmojis =
          Meteor.server.method_handlers["comments.updateEmojis"];
        updateEmojis.apply(invocation, [updatedEmojis, commentId]);

        const comment = Comments.findOne({ _id: commentId });
        performAssertions(
          comment,
          updatedText,
          randDiscussionId,
          userId,
          updatedEmojis
        );
        assert.equal(Comments.find().count(), 1);
      });

      // Test that a comment can be deleted.
      it("Delete own comment", function () {
        const deleteComment = Meteor.server.method_handlers["comments.remove"];
        deleteComment.apply(invocation, [commentId]);
        assert.equal(Comments.find().count(), 0);
      });
    });
  });
}

function performAssertions(comment, text, discussion, author, emojis) {
  assert.equal(comment.text, text);
  assert.equal(comment.discussionId, discussion);
  assert.equal(comment.authorId, author);
  assert.equal(comment.emojis.length, emojis.length);
  for (i = 0; i < emojis.length; i++) {
    assert.equal(comment.emojis[i], emojis[i]);
  }
}
