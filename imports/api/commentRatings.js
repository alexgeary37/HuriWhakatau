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
    
    const mongoModifierObject = {
      $push: { ratings: rating },
    };

    // Check the comment rating against the schema.
    CommentRatings.schema.validate(mongoModifierObject, { modifier: true });

    if (CommentRatings.schema.isValid()) {
      CommentRatings.update(
        { commentId: commentId, experimentId: experimentId },
        mongoModifierObject,
        { upsert: true }
      );
    } else {
      console.log("validationErrors:", CommentRatings.schema.validationErrors());
    }
  },

  "commentRatings.removeAll"() {
    CommentRatings.remove({});
    console.log('CommentRatings.count():', CommentRatings.find().count());
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
