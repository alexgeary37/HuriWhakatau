import { Roles } from "meteor/alanning:roles";
import { Usernames, Maorinames } from "/imports/api/usernames";
import { Random } from 'meteor/random'
import {check} from "meteor/check";
import {Comments} from "./comments";
import {Mongo} from "meteor/mongo";

Meteor.methods({
  //Note these methods take time to return a value from the database,
  // a callback method must be used as part of Meteor.call()
  "security.checkRole"(userId, role) {
    console.log("about to check role for :" & Meteor.userId());
    if (!Roles.userIsInRole(userId, role)) {
      console.log("nope don't have that role");
      // throw new Meteor.Error('not-authorized');  put back in use once roles sorted.
    } else {
      console.log("role check successful");
    }
  },

  "security.hasRole"(userId, role) {
    return Roles.userIsInRole(userId, role);
  },

    "security.checkLoggedIn"(userId) {
        if (!userId) {
            throw new Meteor.Error('not-authorized', 'You are not authorized');
        } else {
            console.log("login check successful");
        }
        ;
    },
    "security.setRoles"(userIds, roles) {
        if (!Roles.userIsInRole(Meteor.userId(), ["ADMIN", "RESEARCHER"])) {
            throw new Meteor.Error('not-authorized');
        } else {
            Roles.addUsersToRoles(userIds, roles);
        };
    },

    "security.addUser"(userName, password, email, userAnon, roles){
        if (!Roles.userIsInRole(Meteor.userId(), ["ADMIN", "RESEARCHER"])) {
            throw new Meteor.Error('not-authorized');
        } else {
            // start of taking a list of only emails and generating
            // usernames and accounts, then sending invite emails
            let finalUserName = '';
            if(userAnon || (!userAnon && userName === "")) {
                // add in a check for using maori names and sub in the Maorinames list
                do {
                    finalUserName = Random.choice(Usernames);
                    // Generate new names until one that does not exist is found
                } while (Meteor.users.findOne({username: finalUserName}));
                console.log(finalUserName);
            } else {
                finalUserName = userName
            };


            const userId = Accounts.createUser({
                username: finalUserName,
                email:email,
            });
            Accounts.sendEnrollmentEmail(userId);
            Roles.addUsersToRoles(userId, roles);
        };
    },

    "security.updatePepeha"(pepeha, userId){
            console.log("updating user pepeha");
            check(userId, String);
            check(pepeha, Array);

            Meteor.users.update(userId, {
                $set: {
                    pepeha: pepeha,
                },
            });
            return true;
    },

    "security.updateName"(name, userId){
        console.log("updating user name");
        check(userId, String);
        check(name, String);

        Meteor.users.update(userId, {
            $set: {
                name: name,
            },
        });
        return true;
    },
})
