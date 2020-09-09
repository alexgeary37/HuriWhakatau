import { Meteor } from "meteor/meteor";
import "/imports/api/groups";
import "/imports/api/scenarios";
import "/imports/api/scenarioSets";
import "/imports/api/discussions";
import "/imports/api/comments";
import "/imports/api/verdicts";
import "/imports/api/votes";
import "/imports/api/security";
import "/imports/api/topics";
import "/imports/api/categories";
import "/imports/api/discussionTemplate";

import { Roles } from 'meteor/alanning:roles';


import { Groups } from "/imports/api/groups";
import { Scenarios } from "/imports/api/scenarios";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { Discussions } from "/imports/api/discussions";
import { Comments } from "/imports/api/comments";
import { Verdicts } from "/imports/api/verdicts";
import { Votes } from "/imports/api/votes";
import {Categories} from "../imports/api/categories";

Meteor.startup(() => {

  //create categories if the basic set doesn't exist
  if (Categories.find().count() === 0) {
    Categories.insert({ name: "Politics" });
    Categories.insert({ name: "Religion" });
    Categories.insert({ name: "Philosophy" });
    Categories.insert({ name: "Sport" });
    Categories.insert({ name: "Science" });
    Categories.insert({ name: "Other" });
  }


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


  if (Meteor.isServer) {
    //set up roles if they don't exist
    let createdRoles = Roles.getAllRoles();
    let roleList = [];
    createdRoles.forEach((role) => {
      roleList.push(role._id);
    });
    console.log(roleList);
    //set up roles
    const userRoles = ["CREATE_GROUPS", "CREATE_SCENARIOS", "CREATE_SCENARIOSETS", 'ADMIN', 'RESEARCHER',
      'PARTICIPANT_W', "PARTICIPANT_I",  "GROUP_LEADER"];

    userRoles.forEach((role) => {
      if(!roleList.includes(role)){
        Roles.createRole(role);
      }
      if(['ADMIN', 'RESEARCHER'].includes(role)){
        !Roles.isParentOf(role,'CREATE_SCENARIOS') && Roles.addRolesToParent('CREATE_SCENARIOS', role);
        !Roles.isParentOf(role,'CREATE_GROUPS') && Roles.addRolesToParent('CREATE_GROUPS', role);
        !Roles.isParentOf(role,'CREATE_SCENARIOSETS') && Roles.addRolesToParent('CREATE_SCENARIOSETS', role);
      }
    })

    //publish required information to client
    Meteor.publish('roles', function () {
      return Meteor.roleAssignment.find({});
    });
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
    // console.log("List all votes\n", Votes.find().fetch());
  }
});
