/*
This is copy pasted from comments.tests.js so it may not work properly
*/

import {Meteor} from "meteor/meteor";
import {Random} from "meteor/random";
import {assert} from "chai";

import {Discussions} from "./discussions.js";

if (Meteor.isServer) {
    describe("Discussions", () => {
        describe("methods", () => {
            const userId = Random.id();
            let discussionId;

            beforeEach(() => {
                Discussions.remove({});

                discussionId = Discussions.insert({
                    title: "Title",
                    description: "Test Description",
                    createdAt: new Date(),
                    createdBy: userId,
                    activeVerdictProposers: [],
                });
            });

            it("can delete owned discussion", () => {
                // Isolate internal method implementation.
                const deleteDiscussion =
                    Meteor.server.method_handlers["discussions.remove"];

                // Set up a fake method call context.
                const invocation = {userId};

                // Run the method with `this` set to the mock context.
                deleteDiscussion.apply(invocation, [discussionId]);

                // Check its behavior.
                assert.equal(Discussions.find().count(), 0);
            });
        });
    });
}
