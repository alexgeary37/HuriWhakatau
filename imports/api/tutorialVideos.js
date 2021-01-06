import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

// attempting to create a collection for videos. not going great ref https://github.com/vsivsi/meteor-file-collection

// export const Videos = new FileCollection("videos", {
//     resumable: false,
//     resumableIndexName: undefined,
//     chunkSize: 2 * 1024 * 1024 - 1024,
//     http: []
// });
//
// Meteor.methods({
//
// });
//
//
// if (Meteor.isServer) {
//     Meteor.publish("videos", function () {
//         return Videos.find({});
//     });
// }

