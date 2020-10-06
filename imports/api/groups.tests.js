import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { assert } from "chai";

import { Groups } from "./groups.js";

if (Meteor.isServer) {
  describe("Groups", function () {
    describe("methods", function () {
      const userId = Random.id();
      const randName = Random.secret();
      const randMembers = ["member1", "member2", "member3", "member4"];

      // Set up a fake method call context.
      const invocation = { userId };
      let groupId;

      // Remove all groups before and after all of the tests.
      before(function () {
        Groups.remove({});
      });
      after(function () {
        Groups.remove({});
      });

      // Test that a group can be inserted.
      it("Create group", function () {
        // Isolate internal method implementation.
        const createGroup = Meteor.server.method_handlers["groups.create"];

        // Run the method with `this` set to the mock context.
        createGroup.apply(invocation, [randName, randMembers]);

        // Check its behavior.
        const group = Groups.find().fetch()[0];
        groupId = group._id;
        performAssertions(group, randName, randMembers, userId);

        // Check number of documents in collection.
        assert.equal(Groups.find().count(), 1);
      });

      it("Vote leader", function () {
        const voteLeader = Meteor.server.method_handlers["groups.voteLeader"];
        // voteLeader.apply(invocation, [groupId, ]);
      });
    });
  });
}

function performAssertions(group, name, members, userId) {
  assert.equal(group.name, name);
  assert.equal(group.members.length, members.length);
  for (i = 0; i < members.length; i++) {
    assert.equal(group.members[i], members[i]);
  }
  assert.equal(group.createdBy, userId);
}
