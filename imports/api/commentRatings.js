import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const CommentRatings = new Mongo.Collection("commentRatings");

CommentRatings.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  commentId: String,
  experimentId: String,
  ratings: [Object]
}).newContext();

Meteor.methods({

  "commentRatings.addRating"(commentId, experimentId, rating) {
    check(commentId, String);
    check(experimentId, String);
    check(rating, Object);

    const commentRatingId = CommentRatings.update(
      { commentId: commentId, experimentId: experimentId },
      {
        $push: { ratings: rating },
      },
      { upsert: true }
    );

    const commentRating = CommentRatings.findOne(commentRatingId);

    // Check the comment rating against the schema.
    CommentRatings.schema.validate(commentRating);
  },

  "commentRatings.removeAll"() {
    CommentRatings.remove({});
  },
});

if (Meteor.isServer) {
  Meteor.publish("commentRatings", function () {
    return CommentRatings.find(
      {},
      {
        fields: {
          commentId: 1,
          experimentId: 1,
          ratings: 1,
        },
      }
    );
  });
}
