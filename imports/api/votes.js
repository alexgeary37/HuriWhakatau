import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {Verdicts} from "./verdicts";

export const Votes = new Mongo.Collection("votes");

Meteor.methods({
    // Insert a vote into the votes collection in the db.
    // userId: _id of the user that made this vote
    // verdictId: _id of the verdict this vote was made on
    // vote: True if user Affirmed, False if user Rejected
    // Called from Verdict.jsx
    "votes.insert"(verdictId, vote) {
        check(verdictId, String);
        check(vote, Boolean);

        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }

        // Get _id of vote being inserted.
        const voteId = Votes.insert(
            {
                userId: this.userId,
                verdictId: verdictId,
                vote: vote,
            },
            (_error, insertedDocs) => {
                return insertedDocs[0]._id;
            }
        );

        // Add voteId to the list of votes this verdict contains.
        Verdicts.update(verdictId, {
            $addToSet: {
                votes: voteId,
            },
        });
    },
});

if (Meteor.isServer) {
    // Votes.remove({});

    Meteor.publish("votes", function (verdictId) {
        return Votes.find(
            {verdictId: verdictId},
            {
                fields: {
                    userId: 1,
                    verdictId: 1,
                    vote: 1,
                },
            }
        );
    });
}
