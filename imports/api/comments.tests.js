import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { Comments } from "./comments.js";

if (Meteor.isServer) {
  describe("Comments", () => {
    describe("methods", () => {
      const userId = Random.id();
      let commentId;

      beforeEach(() => {
        Comments.remove({});

        commentId = Comments.insert({
          postedTime: new Date(),
          authorId: userId,
          text: "Test Comment",
        });
      });

      it("can delete owned comment", () => {
        // Isolate internal method implementation.
        const deleteComment = Meteor.server.method_handlers["comments.remove"];

        // Set up a fake method call context.
        const invocation = { userId };

        // Run the method with `this` set to the mock context.
        deleteComment.apply(invocation, [commentId]);

        // Check its behavior.
        assert.equal(Comments.find().count(), 0);
      });
    });
  });
}
