import { Roles } from 'meteor/alanning:roles';

//Attempting to add roles, but cant seem to create roles and so cannot assign..??

Meteor.methods({
    "security.checkRole"(userId, role) {
        Roles.setUserRoles("Jbs8mB5JaKyNSkuaE", "ADMIN");

        console.log("about tto check roll for :" & Meteor.userId());
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
