import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Groups = new Mongo.Collection("groups");

Groups.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  name: String,
  members: [String],
  previousMembers: [String],
  createdAt: Date,
  createdBy: String,
}).newContext();

Meteor.methods({
  // Insert a Group into the groups collection in the db.
  // Called from CreateGroup.jsx
  "groups.create"(name, members) {
    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    const group = {
      name: name,
      members: members,
      previousMembers: [],
      createdAt: new Date(),
      createdBy: Meteor.userId(),
    };

    // Check group against schema.
    Groups.schema.validate(group);

    if (Groups.schema.isValid()) {
      console.log("Successful validation of group");
      return Groups.insert(group); // Returns _id of group.
    } else {
      console.log("validationErrors:", Groups.schema.validationErrors());
    }
  },

  "groups.addMember"(groupId, memberId) {
    check(groupId, String);

    console.log('addMember');
    
    const mongoModifierObject = {
      $push: {
        members: memberId,
      },
    };

    Groups.schema.validate(mongoModifierObject, { modifier: true });

    if (Groups.schema.isValid()) {
      console.log("Successful validation of group update object");
      Groups.update(groupId, mongoModifierObject);
      return true;
    } else {
      console.log("validationErrors:", Groups.schema.validationErrors());
    }
  },

  "groups.removeMember"(groupId, memberId) {
    check(groupId, String);

    const mongoModifierObject = {
      $pull: {
        members: memberId,
      },
      $push: {
        previousMembers: memberId,
      },
    };

    Groups.schema.validate(mongoModifierObject, { modifier: true });

    if (Groups.schema.isValid()) {
      console.log("Successful validation of group update object");
      Groups.update(groupId, mongoModifierObject);
      return true;
    } else {
      console.log("validationErrors:", Groups.schema.validationErrors());
    }
  },

  // "groups.voteLeader"(groupId, userId) {
  //     Groups.update(
  //         {_id: groupId},
  //         {$inc: {["leaderVotes." + userId]: 1}},
  //         function (err, res) {
  //             let member;
  //             if (err) {
  //                 throw err;
  //             }
  //             let group = Groups.findOne({_id: groupId});
  //             let numMembers = group.members.length;
  //             let leaderVotes = group.leaderVotes;
  //             let numVotes = 0;
  //             for (member in leaderVotes) {
  //                 numVotes += leaderVotes[member];
  //             }
  //
  //             let compare = function (a, b) {
  //                 return b[1] - a[1];
  //             };
  //
  //             if (numVotes >= numMembers) {
  //                 let winner = Object.entries(leaderVotes).sort(compare)[0][0];
  //                 Groups.update({_id: groupId}, {$set: {groupLeader: winner}});
  //                 console.log("winner is: ", winner);
  //             }
  //         }
  //     );
  // },

  "groups.removeAll"() {
    Groups.remove({});
  },
});

if (Meteor.isServer) {
  if (!process.env.MONGO_URL.includes("juryroom_admin")) {
    console.log("minimongo groups");
  } else {
    console.log("not minimongo groups");
  }

  Meteor.publish("groups", function () {
    return Groups.find(
      {},
      {
        fields: {
          name: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
          leaderVotes: 1,
          groupLeader: 1,
        },
      }
    );
  });
}
