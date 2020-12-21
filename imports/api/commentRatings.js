import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const CommentRatings = new Mongo.Collection("commentRatings");

Meteor.methods({
    "commentRatings.addRating"(commentId, experimentId, rating){
        check(commentId, String);
        check(experimentId, String);
        check(rating, Object);

        CommentRatings.update({commentId: commentId, experimentId: experimentId},{
            $push: {ratings: rating}
        },
            {upsert: true});
    },
});

if(Meteor.isServer){
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
