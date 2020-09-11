import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {Groups} from "./groups";
import {ScenarioSets} from "./scenarioSets";
import {Scenarios} from "./scenarios";

export const Experiments = new Mongo.Collection("experiments");

Meteor.methods({
    // Insert a category into the category collection in the db.
    // name: the category name
    // Called from *****
    "experiments.create"(name, description, groupId, scenarioSetId) {
        check(name, String);
        //addcheck for user admin/researcher role

        const experimentId = Experiments.insert({
            name: name,
            description: description,
            groupId: groupId,
            scenarioSetId: scenarioSetId,
            createdAt: new Date(),
            createdBy: Meteor.userId(),
        });
        console.log(experimentId);
        const set = ScenarioSets.findOne({_id: scenarioSetId});
        const scenarios = Scenarios.find({_id: {$in: set.scenarios}}).fetch();

        for (i = 0; i < scenarios.length; i++) {
            console.log("creating discussion");
            Meteor.call("discussions.insert", scenarios[i]._id, groupId);
        }
    },

    // Remove a category from the categories collection in the db.
    // categoryId: _id of the comment to be removed
    // Called from Discussion.jsx
    "experiments.remove"(experimentId) {
        check(experimentId, String);
        //add role check

        Experiments.remove(experimentId);
    },
});

if (Meteor.isServer) {

    Meteor.publish("experiments", function () {
        return Experiments.find(
            {},
            {
                fields: {
                    name: 1,
                    description: 1,
                    groupId: 1,
                    scenarioSetId: 1,
                    createdAt: 1,
                    createdBy: 1,
                },
            }
        );
    });
}
