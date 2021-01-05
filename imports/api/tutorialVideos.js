import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";
import {} from "";

export const Videos = new FileCollection("videos", {
    resumable: false,
    resumableIndexName: undefined,
    chunkSize: 2 * 1024 * 1024 - 1024,
    http: []
});

Meteor.methods({

});


if (Meteor.isServer) {
    Meteor.publish("videos", function () {
        return Videos.find({});
    });
}

