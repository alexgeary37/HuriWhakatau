import { Roles } from 'meteor/alanning:roles';

//Attempting to add roles, but cant seem to create roles and so cannot assign..??
// Called when the server starts up.
if (Meteor.isServer) {
    Meteor.publish("roles", () => Meteor.roleAssignment.find({}));
}

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
