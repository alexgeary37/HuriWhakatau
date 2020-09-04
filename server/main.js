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
  if (!Accounts.findUserByUsername("OpenlyOctopus")) {
    Accounts.createUser({
      username: "OpenlyOctopus",
      password: "password1",
    });
  }
  if (!Accounts.findUserByUsername("HairyHog")) {
    Accounts.createUser({
      username: "HairyHog",
      password: "password2",
    });
  }
  if (!Accounts.findUserByUsername("DizzyDandylion")) {
    Accounts.createUser({
      username: "DizzyDandylion",
      password: "password3",
    });
  }

  //add a group

  if (Meteor.isServer) {
    if(!Meteor.roles.findOne({name: "ADMIN"})){
      // Roles.createRole('ADMIN');
    }

    Meteor.publish(null, () => Meteor.roles.find({}));
    Meteor.publish("users", function () {
      return Meteor.users.find();
    });

    // Meteor.users.remove();
    // console.log("List all users\n", Meteor.users.find().fetch()); //
    // console.log("List all groups\n", Groups.find().fetch());
    // console.log("List all scenarios\n", Scenarios.find().fetch());
    // console.log("List all scenarioSets\n", ScenarioSets.find().fetch());
    // console.log("List all discussions\n", Discussions.find().fetch());
    // console.log("List all comments\n", Comments.find().fetch());
    // console.log("List all verdicts\n", Verdicts.find().fetch());
    console.log("List all votes\n", Votes.find().fetch());
  }
});
