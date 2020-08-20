import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Groups = new Mongo.Collection("groups");

Meteor.methods({
  // Insert a Group into the groups collection in the db.
  // members: _ids of the users in this group
  // discussions: _ids of the discussions this Group will discuss
  // Called from CreateGroup.jsx
  "groups.create"(name, members, discussions) {
    check(name, String);
    check(members, Array);
    check(discussions, Array);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    // Insert new Group and get its _id.
    Groups.insert({
      name: name,
      members: members,
      discussions: discussions,
      createdAt: new Date(),
      createdBy: this.userId,
    });
  },
});

if (Meteor.isServer) {
  // Groups.remove({});

  Meteor.publish("groups", function (userId) {
    return Groups.find();
  });

  // List all the Groups in the db
  console.log("List all groups\n", Groups.find().fetch());
}
