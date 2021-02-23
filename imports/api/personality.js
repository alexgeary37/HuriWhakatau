import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Personality = new Mongo.Collection("personality");

Personality.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  questionnaireName: String,
  paperDoi: String,
  items: [Object],
  'items.$.item': SimpleSchema.Integer,
  'items.$.text': String,
  'items.$.scale': SimpleSchema.Integer,
  'items.$.scoringReversed': Boolean,
  'items.$.responseType': String
}).newContext();

Meteor.methods({
  "personality.insert"(name, doi, items) {
    const personality = {
      questionnaireName: name,
      paperDoi: doi,
      items: items
    };

    // Check personality against schema.
    Personality.schema.validate(personality);

    if (Personality.schema.isValid()) {
      Personality.insert(personality);
    } else {
      console.log("validationErrors:", Personality.schema.validationErrors());
    }
  },

  //get a random personality question.
  "personality.getRandomQuestion"() {
    if (Meteor.isServer) {
      const fetchedQuestion = Personality.rawCollection()
        .aggregate([
          { $sample: { size: 1 } }, // Select 1 document from collection.
          {
            $project: {
              item: {
                $arrayElemAt: [
                  "$items",
                  {
                    $floor: { $multiply: [{ $size: "$items" }, Math.random()] },
                  },
                ],
              },
            },
          },
        ])
        .toArray();
      return fetchedQuestion;
    }
  },

  "personality.removeAll"() {
    Personality.remove({});
    console.log('Personality.count():', Personality.find().count());
  },
});

if (Meteor.isServer) {
  Meteor.publish("personality", function () {
    return Personality.find(
      {},
      {
        fields: {
          questionnaireName: 1,
          items: 1,
        },
      }
    );
  });
}
