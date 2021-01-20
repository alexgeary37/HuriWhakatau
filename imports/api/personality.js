import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";

export const Personality = new Mongo.Collection("personality");

Personality.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  questionnaire: Object
}).newContext();

Meteor.methods({
  "personality.insert"(questionnaire) {
    const personality = {
      questionnaire,
    };

    // Check personality against schema.
    Personality.schema.validate(personality);

    if (Personality.schema.isValid()) {
      console.log('Successful validation of personality');
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
          { $sample: { size: 1 } },
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
