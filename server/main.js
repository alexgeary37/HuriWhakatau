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
import "/imports/api/experiments"
import "/imports/api/accountsEmail"
import "/server/defaultData";
import { Roles } from "meteor/alanning:roles";

import { Groups } from "/imports/api/groups";
import { Scenarios } from "/imports/api/scenarios";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { Discussions } from "/imports/api/discussions";
import { Comments } from "/imports/api/comments";
import { Verdicts } from "/imports/api/verdicts";
import { Votes } from "/imports/api/votes";
import { Categories } from "../imports/api/categories";

Meteor.startup(() => {
  //create categories if the basic set doesn't exist

    process.env.MAIL_URL =
        "smtps://juryrooms%40gmail.com:sxzvoqkplfteqpwk@smtp.gmail.com:465/";
    // "smtps://dsten32%40gmail.com:RabbitseatpooGoogle@smtp.gmail.com:465/";
    // console.log("email set");



  if (Meteor.isServer) {

    //publish required information to client
    Meteor.publish("roles", function () {
      return Meteor.roleAssignment.find({});
    });
    Meteor.publish("users", function () {
      return Meteor.users.find();
    });

    // Meteor.users.remove();
  }
});
