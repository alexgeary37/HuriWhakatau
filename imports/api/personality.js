import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Personality = new Mongo.Collection("personality");

Meteor.methods({
    "personality.insert"(questionnaire) {
        check(questionnaire, Object);

        Personality.insert({
            questionnaire,
        });
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
