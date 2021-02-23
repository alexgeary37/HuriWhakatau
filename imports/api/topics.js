import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Topics = new Mongo.Collection("topics");

Topics.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  title: String,
  description: String,
  categoryId: String,
  createdAt: Date,
  createdBy: String
}).newContext();

Meteor.methods({
  // Insert a topic into the topic collection in the db.
  "topics.insert"(title, description, categoryId) {
    //addcheck for user admin/researcher role

    const topic = {
      title: title,
      description: description,
      categoryId: categoryId,
      createdAt: new Date(),
      createdBy: Meteor.userId()
    };

    // Check topic against schema.
    Topics.schema.validate(topic);

    if (Topics.schema.isValid()) {
      Topics.insert(topic);
    } else {
      console.log("validationErrors:", Topics.schema.validationErrors());
    }
  },

  // Remove a topic from the topics collection in the db.
  // topicId: _id of the tpoic to be removed
  // Called from Discussion.jsx
  "topics.remove"(topicId) {
    check(topicId, String);
    //todo add role check

    Topics.remove(topicId);
  },

  "topics.removeAll"() {
    Topics.remove({});
    console.log('Topics.count():', Topics.find().count());
  }
});

if (Meteor.isServer) {
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
