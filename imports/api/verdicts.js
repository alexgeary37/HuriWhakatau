import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {Discussions} from "./discussions";

export const Verdicts = new Mongo.Collection("verdicts");

Meteor.methods({
    // Insert a Verdict into the verdicts collection in the db.
    // text: the text of the Verdict
    // discussionId: _id of the Viscussion this Verdict belongs to
    // Called from VerdictForm.jsx
    "verdicts.insert"(text, discussionId) {
        check(text, String);
        check(discussionId, String);

        // I believe this means it's checking that the user is the client currently calling this method.
        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }

        // Insert new Verdict and get its _id.
        const verdictId = Verdicts.insert({
            discussionId: discussionId,
            postedTime: new Date(),
            authorId: this.userId, // _id of user.
            text: text,
            votes: [], // _ids of votes that all OTHER users have given.
        });

        // Add _id of inserted Verdict and the author of it.
        Discussions.update(discussionId, {
            $addToSet: {
                verdicts: verdictId,
            },
        });

        // Remove this user from the list of activeVerdictProposers in the Discussion.
        Meteor.call("discussions.removeProposer", discussionId);
    },

    "verdicts.addVote"(verdictId, vote) {
        check(verdictId, String);
        check(vote, Boolean);

        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }

        // Add a vote with the voter's ID and the time of the vote to the given verdict.
        Verdicts.update(verdictId, {
            $addToSet: {
                votes: {userId: this.userId, vote: vote, voteTime: new Date()},
            },
        });
    },
});

if (Meteor.isServer) {
    // Verdicts.remove({});

    Meteor.publish("verdicts", function (discussionId) {
        return Verdicts.find(
            {discussionId: discussionId},
            {
                fields: {
                    discussionId: 1,
                    postedTime: 1,
                    authorId: 1,
                    text: 1,
                    votes: 1,
                },
            }
        );
    });
}
