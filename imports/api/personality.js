import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import {Experiments} from "./experiments";

export const Personality = new Mongo.Collection("personality");

Meteor.methods({
    "personality.insert"(questionnaire) {
        check(questionnaire, Object);
        Personality.insert({
            questionnaire,
        });
    },

    //get a random personality question
    "personality.getRandomQuestion"() {
        const fetchedQuestion = Personality.rawCollection().aggregate([
            {$sample: {size: 1}},
            {
                $project:
                    {
                        item:{ $arrayElemAt: [ "$items", { $floor:{$multiply: [{$size: "$items"}, Math.random() ]}}] },
                    }
            }
        ])
            .toArray();
        return fetchedQuestion;
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
