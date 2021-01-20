import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Mountains = new Mongo.Collection("mountains");

Mountains.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  name: String
}).newContext();

Meteor.methods({
  "mountains.insert"(name) {
    
    const mountain = { name: name };

    // Check mountain against schema.
    Mountains.schema.validate(mountain);

    if (Mountains.schema.isValid()) {
      console.log('Successful validation of mountain');
      Mountains.insert(mountain);
    } else {
      console.log("validationErrors:", Mountains.schema.validationErrors());
    }
  },

  "mountains.removeAll"() {
    Mountains.remove({});
  }
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
