import {check} from "meteor/check";


Meteor.methods({
    "users.updatePepeha"(pepeha, userId){
        console.log("updating user pepeha");
        check(userId, String);
        check(pepeha, Object);

        Meteor.users.update(userId, {
            $set: {
                pepeha: pepeha,
            },
        });
        return true;
    },

    "users.updateUsername"(username, userId){
        console.log("updating username");
        check(userId, String);
        check(username, String);

        Meteor.users.update(userId, {
            $set: {
                username: username,
            },
        });
        return true;
    },

    "users.updateUserDetails"(detailsObject, userId){
        console.log("updating user details");
        check(userId, String);
        check(detailsObject, Object);

        Meteor.users.update(userId, {
            $set: {
                userDetails: {
                    firstName: detailsObject.firstName,
                    lastName: detailsObject.lastName,
                    ethnicity: detailsObject.ethnicity,
                    location: detailsObject.location,
                    gender: detailsObject.gender,
                    dob: detailsObject.dob,
                    religion: detailsObject.religion,
                }
            },
        });
        return true;
    },
});

if (Meteor.isServer) {
    // Scenarios.remove({});

    Meteor.publish("users", function () {
        return Meteor.users.find(
            {},
            {
                fields: {
                    username: 1,
                    userDetails: 1,
                    friends: 1,
                    pepeha: 1,
                    online: 1,
                },
            }
        );
    });
}
