import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Categories = new Mongo.Collection("categories");

Categories.schema = new SimpleSchema({
  title: String,
  createdBy: String
});

Meteor.methods({
  // Insert a category into the category collection in the db.
  "categories.insert"(name) {
    //addcheck for user admin/researcher role

    const category = {
      title: name,
      createdBy: this.userId, // _id of user
    };

    // Check category against schema.
    Categories.schema.validate(category);

    Categories.insert(category);
  },

  // Remove a category from the categories collection in the db.
  // categoryId: _id of the comment to be removed
  // Called from Discussion.jsx
  "categories.remove"(categoryId) {
    check(categoryId, String);
    //add role check

    Categories.remove(categoryId);
  },

  "categories.removeAll"() {
    Categories.remove({});
  }
});

if (Meteor.isServer) {
  Meteor.publish("categories", function () {
    return Categories.find(
      {},
      {
        fields: {
          title: 1,
        },
      }
    );
  });
}
