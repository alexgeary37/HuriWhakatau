import { Roles } from "meteor/alanning:roles";
import { Usernames } from "/imports/api/usernames";
import { Random } from "meteor/random";

if(Meteor.isServer){
  Meteor.methods({
    "security.addUser"(userName, email, userAnon, roles) {
      //removed user role check so that non-logged in user can create invite
      // if (!Roles.userIsInRole(Meteor.userId(), ["ADMIN", "RESEARCHER"])) {
      //     throw new Meteor.Error('not-authorized');
      // } else {
      // start of taking a list of only emails and generating
      // usernames and accounts, then sending invite emails
      
      let finalUserName = "";
      let usernames = Usernames.find({}, { fields: { name: 1 } });
      if (userAnon || (!userAnon && userName === "")) {
        // add in a check for using maori names and sub in the Maorinames list
        do {
          finalUserName = Random.choice(usernames);
          // Generate new names until one that does not exist is found
        } while (Meteor.users.findOne({ username: finalUserName }));
      } else {
        finalUserName = userName;
      }
  
      const userId = Accounts.createUser({
        username: finalUserName,
        email: email,
        profile: {
          pepeha: {
            mountain: "",
            river: "",
            waka: "",
            iwi: "",
            role: "",
          },
          userDetails: {
            firstName: "",
            lastName: "",
            ethnicity: "",
            location: "",
            gender: "",
            dob: "",
            religion: "",
          },
          emotion: {
            emotion: "neutral",
            timestamp: Date.now(),
          },
        },
      });
      Accounts.sendEnrollmentEmail(userId);
      Roles.addUsersToRoles(userId, roles);
    },
  });
}

Meteor.methods({
  //Note these methods take time to return a value from the database,
  // a callback method must be used as part of Meteor.call()
  "security.checkRole"(userId, role) {
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
      throw new Meteor.Error("not-authorized", "You are not authorized");
    }
  },
  "security.setRoles"(userIds, roles) {
    if (!Roles.userIsInRole(Meteor.userId(), ["ADMIN", "RESEARCHER"])) {
      throw new Meteor.Error("not-authorized");
    } else {
      Roles.addUsersToRoles(userIds, roles);
    }
  },

  // "security.updatePepeha"(pepeha, userId){
  //         console.log("updating user pepeha");
  //         check(userId, String);
  //         check(pepeha, Object);
  //
  //         Meteor.users.update(userId, {
  //             $set: {
  //                 pepeha: pepeha,
  //             },
  //         });
  //         return true;
  // },

  // "security.updateUsername"(username, userId){
  //     console.log("updating username");
  //     check(userId, String);
  //     check(username, String);
  //
  //     Meteor.users.update(userId, {
  //         $set: {
  //             username: username,
  //         },
  //     });
  //     return true;
  // },
  //
  // "security.updateUserDetails"(detailsObject, userId){
  //     console.log("updating user details");
  //     check(userId, String);
  //     check(detailsObject, Object);
  //
  //     Meteor.users.update(userId, {
  //         $set: {
  //             userDetails: {
  //                 firstName: detailsObject.firstName,
  //                 lastName: detailsObject.lastName,
  //                 ethnicity: detailsObject.ethnicity,
  //                 location: detailsObject.location,
  //                 gender: detailsObject.gender,
  //                 dob: detailsObject.dob,
  //                 religion: detailsObject.religion,
  //             }
  //         },
  //     });
  //     return true;
  // },
});
