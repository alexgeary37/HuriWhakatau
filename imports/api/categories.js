import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const Categories = new Mongo.Collection("categories");

Meteor.methods({
    // Insert a category into the category collection in the db.
    // name: the category name
    // Called from *****
    "categories.insert"(name) {
        check(name, String);
        //addcheck for user admin/researcher role

        Categories.insert({
            name: name,
            createdBy: this.userId, // _id of user
        });
    },

    // Remove a category from the categories collection in the db.
    // categoryId: _id of the comment to be removed
    // Called from Discussion.jsx
    "categories.remove"(categoryId) {
        check(categoryId, String);
        //add role check

        Categories.remove(categoryId);
    },
});

if (Meteor.isServer) {

    Meteor.publish("categories", function () {
        return Categories.find(
            {},
            {
                fields: {
                    name: 1,
                    createdBy: 1,
                },
            }
        );
    });
}
