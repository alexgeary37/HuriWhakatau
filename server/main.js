import { Meteor } from "meteor/meteor";
import "/imports/api/groups";
import "/imports/api/scenarios";
import "/imports/api/scenarioSets";
import "/imports/api/discussions";
import "/imports/api/comments";
import "/imports/api/verdicts";
import "/imports/api/votes";

import { Groups } from "/imports/api/groups";
import { Scenarios } from "/imports/api/scenarios";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { Discussions } from "/imports/api/discussions";
import { Comments } from "/imports/api/comments";
import { Verdicts } from "/imports/api/verdicts";
import { Votes } from "/imports/api/votes";

Meteor.startup(() => {
  // Create accounts
  if (!Accounts.findUserByUsername("alex")) {
    Accounts.createUser({
      username: "alex",
      password: "password1",
    });
  }
  if (!Accounts.findUserByUsername("geary")) {
    Accounts.createUser({
      username: "geary",
      password: "password2",
    });
  }
  if (!Accounts.findUserByUsername("alexgeary")) {
    Accounts.createUser({
      username: "alexgeary",
      password: "password3",
    });
  }

  if (Meteor.isServer) {
    Meteor.publish("users", function () {
      return Meteor.users.find();
    });

    Groups.remove();
    Scenarios.remove();
    ScenarioSets.remove();
    Discussions.remove();
    Comments.remove();
    Verdicts.remove();
    Votes.remove();

    console.log("List all groups\n", Groups.find().fetch());
    console.log("List all scenarios\n", Scenarios.find().fetch());
    console.log("List all scenarioSets\n", ScenarioSets.find().fetch());
    console.log("List all discussions\n", Discussions.find().fetch());
    console.log("List all comments\n", Comments.find().fetch());
    console.log("List all verdicts\n", Verdicts.find().fetch());
    console.log("List all votes\n", Votes.find().fetch());
  }
});
