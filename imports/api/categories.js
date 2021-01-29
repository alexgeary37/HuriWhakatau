import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const Categories = new Mongo.Collection("categories");

Categories.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  title: String,
  createdBy: String
}).newContext();

Meteor.methods({
  // Insert a category into the category collection in the db.
  "categories.validate"(category) {
    validate(category);
  },

  "categories.insert"(name) {
    //addcheck for user admin/researcher role

    const category = {
      title: name,
      createdBy: Meteor.userId(),
    };

    // Check category against schema.
    Categories.schema.validate(category);

    if (Categories.schema.isValid()) {
      console.log('Successful validation of category');
      Categories.insert(category);
    } else {
      console.log('validationErrors:', Categories.schema.validationErrors());
    }
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
    console.log('Categories.count():', Categories.find().count());
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
