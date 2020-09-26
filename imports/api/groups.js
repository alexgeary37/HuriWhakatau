import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { Scenarios } from "/imports/api/scenarios";

export const Groups = new Mongo.Collection("groups");

Meteor.methods({
    // Insert a Group into the groups collection in the db.
    // members: _ids of the users in this group
    // discussions: _ids of the discussions this Group will discuss
    // Called from CreateGroup.jsx
    "groups.create"(name, members, scenarioSet) {
        check(name, String);
        check(members, Array);
        // check(scenarioSet, String);

        // I believe this means it's checking that the user is the client currently calling this method.
        if (!this.userId) {
            throw new Meteor.Error("Not authorized.");
        }

        const groupId = Groups.insert({
            name: name,
            members: members,
            // scenarioSet: scenarioSet,
            createdAt: new Date(),
            createdBy: this.userId,
        });
    },

    "groups.voteLeader"(groupId, userId){
        Groups.update({_id: groupId},
            { $inc: {["leaderVotes."+userId] : 1}},
            function(err, res) {
            let member;
                if (err) {throw err}
            let group = Groups.findOne({_id: groupId});
            let numMembers = group.members.length;
            let leaderVotes = group.leaderVotes;
            let numVotes = 0;
            for (member in leaderVotes) {
                numVotes += leaderVotes[member];
            };

            let compare = function(a, b) {
                return b[1] - a[1];
            }

            if (numVotes >= numMembers){
                let winner = Object.entries(leaderVotes).sort(compare)[0][0];
                Groups.update({_id:groupId},
                    {$set: {groupLeader: winner}});
                console.log("winner is: ", winner);
            }
            });

    },
});

if (Meteor.isServer) {
    // Groups.remove({});

    Meteor.publish("groups", function (userId) {
        return Groups.find(
            {},
            {
                fields: {
                    name: 1,
                    members: 1,
                    // scenarioSet: 1,
                    createdAt: 1,
                    createdBy: 1,
                    leaderVotes: 1,
                    groupLeader: 1,
                },
            }
        );
    });
}
