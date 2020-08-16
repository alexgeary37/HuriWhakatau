import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Discussions = new Mongo.Collection("discussions");

//
Meteor.methods({
  // Insert a discussion into the discussions collection in the db.
  // Called from Dashboardjsx
  "discussions.insert"(title, description) {
    check(title, String);
    check(description, String);

    // I believe this means it's checking that the user is the client currently calling this method.
    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Discussions.insert({
      title: title,
      description: description,
      createdAt: new Date(),
      createdBy: this.userId,
    });
    console.log("End discussions.insert " + title);
  },

  // Remove a Discussion from the discussions collection in the db.
  // discussionId: _id of the discussion to be removed
  // Called from ...
  "discussions.remove"(discussionId) {
    check(discussionId, String);

    const discussion = Discussions.findOne(discussionId);

    // If user is not the creator of the discussion, throw error
    if (!this.userId || discussion.createdBy !== this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Discussions.remove(discussionId);
  },
});

if (Meteor.isServer) {
  // Discussions.remove({});

  Meteor.publish("discussions", function () {
    return Discussions.find({});
  });

  // List all the discussions in the data base.
  console.log("List all discussions\n", Discussions.find({}).fetch());
}
