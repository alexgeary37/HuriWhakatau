import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Mountains = new Mongo.Collection("mountains");

Meteor.methods({
  "mountains.insert"(name) {
    check(name, String);

    Mountains.insert({
      name: name,
    });
  },
});

if (Meteor.isServer) {
  Meteor.publish("mountains", function () {
    return Mountains.find(
      {},
      {
        fields: {
          name: 1,
        },
      }
    );
  });
}
