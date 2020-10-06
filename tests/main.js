import assert from "assert";

import "../imports/api/comments.tests.js";
import "../imports/api/discussions.tests.js";
import "../imports/api/groups.tests.js";

//todo add testing
describe("juryroom", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "juryroom");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
