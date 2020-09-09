import { Roles } from 'meteor/alanning:roles';

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
    };
},

    "security.hasRole"(userId, role) {
        return Roles.userIsInRole(userId, role);
    },

    "security.checkLoggedIn"(userId) {
    if (!userId) {
    throw new Meteor.Error('not-authorized', 'You are not authorized');
} else {
        console.log("login check successful");
    };
},
})
