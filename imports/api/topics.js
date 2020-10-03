import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Topics = new Mongo.Collection("topics");

Meteor.methods({
  // Insert a totpic into the totpic collection in the db.
  // title: the title of the topic
  // description: topic description
  // categoryId: the _id of the category object
  // createdAt: date created
  // createdBy: user _id of creator.
  // Called from ****
  "topics.insert"(title, description, categoryId) {
    check(title, String);
    check(description, String);
    check(categoryId, String);

    //addcheck for user admin/researcher role

    Topics.insert({
      title: title,
      description: description,
      categoryId: categoryId,
      createdAt: new Date(),
      createdBy: this.userId, // _id of user
    });
  },

  // Remove a topic from the topics collection in the db.
  // topicId: _id of the tpoic to be removed
  // Called from Discussion.jsx
  "topics.remove"(topicId) {
    check(topicId, String);
    //todo add role check

    Topics.remove(topicId);
  },
});

if (Meteor.isServer) {
  // console.log("Topics:", Topics.find().fetch());

  Meteor.publish("topics", function () {
    return Topics.find(
      {},
      {
        fields: {
          title: 1,
          description: 1,
          categoryId: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
