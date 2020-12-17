import {check} from "meteor/check";
import {Random} from "meteor/random";
import {Usernames} from "./usernames";


Meteor.methods({
    "users.updatePepeha"(pepeha, userId) {
        console.log("updating user pepeha");
        check(userId, String);
        check(pepeha, Object);

        Meteor.users.update(userId, {
            $set: {
                "profile.pepeha": pepeha,
            },
        });
        return true;
    },

    "users.updateUsername"(username, userId) {
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

    "users.updateUserDetails"(detailsObject, userId) {
        console.log("updating user details");
        check(userId, String);
        check(detailsObject, Object);

        Meteor.users.update(userId, {
            $set: {
                "profile.userDetails": {
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

    "users.getUser"(userId) {
        check(userId, String);

        const user = Meteor.users.findOne({_id: userId});

        return user;
    },

    //return array of users whose username or email matches the search term
    "users.findFriend"(searchTerm) {
        check(searchTerm, String);

        const friends = Meteor.users.find(
            {
                $or: [{
                    username: {
                        $regex: searchTerm,
                        $options: 'i'
                    }
                }, {"emails.address": searchTerm}]
            }, {fields: {username: 1}},
            {sort: {username: 1}}
        ).fetch();

        console.log("found friends:", friends);
        return friends;
    },

    "users.inviteFriend"(email) {
        check(email, String);
        let finalUserName = '';
        do {
            finalUserName = Random.choice(Usernames);
            // Generate new names until one that does not exist is found
        } while (Meteor.users.findOne({username: finalUserName}));
        console.log(finalUserName);

        const userId = Accounts.createUser({
            username: finalUserName,
            email: email,
            profile: {
                invitedBy: Meteor.userId(),
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
            }
        });
        Accounts.sendEnrollmentEmail(userId);
        return true;
    },

    // add a user to friend list
    "users.addFriend"(userId, friendId) {
        check(userId, String);
        check(friendId, String);
        console.log("adding friend: ", friendId);
        Meteor.users.update(userId,
            {
                $addToSet:
                    {"profile.friendList": friendId}
            }
        );
        return true;
    },

    // remove a user from friend list
    "users.removeFriend"(userId, friendId) {
        check(userId, String);
        check(friendId, String);

        Meteor.users.update(userId,
            {
                $pull:
                    {"profile.friendList": friendId}
            }
        );
        return true;
    },

    // add a user to friend list
    "users.addPendingFriend"(userId, friendId) {
        check(userId, String);
        check(friendId, String);
        console.log("adding pending friend: ", friendId, "to user", userId);
        Meteor.users.update(userId,
            {
                $addToSet:
                    {"profile.pendingFriendList": friendId}
            }
        );
        return true;
    },

    // remove a user from friend list
    "users.removePendingFriend"(userId, friendId) {
        check(userId, String);
        check(friendId, String);

        Meteor.users.update(userId,
            {
                $pull:
                    {"profile.pendingFriendList": friendId}
            }
        );
        return true;
    },

    //return array of users whose username or email matches the search term
    "users.findInvitedFriendId"(token) {
        check(token, String);
        console.log("finding friend")
        const friendId = Meteor.users.findOne(
            {"services.password.reset.token": token}, {fields: {_id: 1}}
        );
        return friendId;
    },

    //save user personality question
    "users.recordPersonalityAnswer"(userId, questionnaireAnswer) {
        check(userId, String);
        check(questionnaireAnswer, Object);

        // attempting to work out how to update an object in the personality array, if it exists to add the user's
        // question score, but add the questionnaire details to the array with score if doesn't exist. not going well
        // let {questionnaireId, item, answerScore} = questionnaireAnswer;
        // console.log("setting personality question", questionnaireId, item, answerScore);
        // let questionnaireAnswers = {};
        // let scoreObject = {};
        // scoreObject[item] = answerScore;
        //

        // let userPersonality = Meteor.users.findOne({_id: userId},
        //     {fields: {"profile.personality": { $elemMatch: { questionnaireId:questionnaireAnswer.questionnaireId}}}});
        // console.log("user personality item: ", userPersonality);
        // if (userPersonality) {
        //     let index = userPersonality.findIndex((questionnaire => questionnaire.questionnaireId === questionnaireId));
        //     if (index > -1) {
        //         userPersonality[index]["scores"].push({answerScore});
        //
        //     } else {
        //         questionnaireAnswers["questionnaireId"] = questionnaireId;
        //         questionnaireAnswers["scores"].push({answerScore});
        //
        //     }
        // }
        Meteor.users.update(userId,
            {
                $addToSet:
                    {"profile.personality": questionnaireAnswer}
            })

        if (Meteor.isServer) {

            let user = Meteor.users.rawCollection().aggregate([
                {$match: {_id: userId}},
                {$unwind: "$profile.personality"},
                {$match: {"profile.personality": {$elemMatch: {questionnaireId: questionnaireAnswer.questionnaireId}}}}
            ]).toArray();
            console.log("user", user);
        }
    }
    ,

    //set user's emotional state
    "users.setEmotion"(userId, emotionOb) {
        check(userId, String);
        check(emotionOb, Object);
        console.log('setting emotion');
        Meteor.users.update(userId,
            {
                $set:
                    {"profile.emotion": emotionOb}
            }
        );
        return true;
    }
    ,
})
;

if (Meteor.isServer) {
    Meteor.publish("users", function () {
        return Meteor.users.find(
            {},
            {
                fields: {
                    username: 1,
                    "profile.userDetails": 1,
                    "profile.friendList": 1,
                    "profile.pendingFriendList": 1,
                    "profile.pepeha": 1,
                    "profile.emotion": 1,
                    online: 1,
                    status: 1,
                },
            }
        );
    });
}
