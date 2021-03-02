import { check } from "meteor/check";
import { Random } from "meteor/random";
import { Usernames } from "./usernames";
import { CommentRatings } from "./commentRatings";
import { Comments } from "./comments";
import { Verdicts } from "./verdicts";
import { Meteor } from "meteor/meteor";
import { Personality } from "./personality";

const emailAddress = "huriwhakatau@gmail.com";

Meteor.methods({
  "users.updatePepeha"(pepeha, userId) {
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
        },
      },
    });
    return true;
  },

  "users.getUser"(userId) {
    check(userId, String);

    const user = Meteor.users.findOne({ _id: userId });

    return user;
  },

  //return array of users whose username or email matches the search term
  "users.findFriend"(searchTerm) {
    check(searchTerm, String);

    const friends = Meteor.users
      .find(
        {
          $or: [
            {
              username: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            { "emails.address": searchTerm },
          ],
        },
        { fields: { username: 1 } },
        { sort: { username: 1 } }
      )
      .fetch();

    return friends;
  },

  "users.inviteFriend"(email) {
    check(email, String);
    let finalUserName = "";
    do {
      finalUserName = Random.choice(Usernames);
      // Generate new names until one that does not exist is found
    } while (Meteor.users.findOne({ username: finalUserName }));
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
      },
    });
    Accounts.sendEnrollmentEmail(userId);
    return true;
  },

  // add a user to friend list
  "users.addFriend"(userId, friendId) {
    check(userId, String);
    check(friendId, String);
    Meteor.users.update(userId, {
      $addToSet: { "profile.friendList": friendId },
    });
    return true;
  },

  // remove a user from friend list
  "users.removeFriend"(userId, friendId) {
    check(userId, String);
    check(friendId, String);

    Meteor.users.update(userId, {
      $pull: { "profile.friendList": friendId },
    });
    return true;
  },

  // add a user to friend list
  "users.addPendingFriend"(userId, friendId) {
    check(userId, String);
    check(friendId, String);
    Meteor.users.update(userId, {
      $addToSet: { "profile.pendingFriendList": friendId },
    });
    return true;
  },

  // remove a user from friend list
  "users.removePendingFriend"(userId, friendId) {
    check(userId, String);
    check(friendId, String);

    Meteor.users.update(userId, {
      $pull: { "profile.pendingFriendList": friendId },
    });
    return true;
  },

  //return array of users whose username or email matches the search term
  "users.findInvitedFriendId"(token) {
    check(token, String);
    const friendId = Meteor.users.findOne(
      { "services.password.reset.token": token },
      { fields: { _id: 1 } }
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
    Meteor.users.update(userId, {
      $addToSet: { "profile.personality": questionnaireAnswer },
    });

    if (Meteor.isServer) {
      let user = Meteor.users
        .rawCollection()
        .aggregate([
          { $match: { _id: userId } },
          { $unwind: "$profile.personality" },
          {
            $match: {
              "profile.personality": {
                $elemMatch: {
                  questionnaireId: questionnaireAnswer.questionnaireId,
                },
              },
            },
          },
        ])
        .toArray();
      console.log("user", user);
    }
  },

  //set user's emotional state
  "users.setEmotion"(userId, emotionOb) {
    check(userId, String);
    check(emotionOb, Object);
    Meteor.users.update(userId, {
      $set: { "profile.emotion": emotionOb },
    });
    return true;
  },

  //send an email to confirm user identity prior to sending data
  "users.validateUserForDataExport"(userId) {
    if (Meteor.isServer) {
      const user = Meteor.users.findOne({ _id: userId });
      if (user) {
        const exportingUserEmail = user.emails[0].address;
        const verificationToken = Accounts.generateVerificationToken(
          userId,
          exportingUserEmail
        );

        let verificationURL;
        if (process.env.ROOT_URL[process.env.ROOT_URL.length - 1] === "/") {
          console.log("slash = yes");
          verificationURL =
            process.env.ROOT_URL +
            "confirm-identity/" +
            verificationToken.token +
            "/" +
            userId;
        } else {
          console.log("slash = no");
          verificationURL =
            process.env.ROOT_URL +
            "/confirm-identity/" +
            verificationToken.token +
            "/" +
            userId;
        }

        let emailBody = `Please confirm your identity by clicking the link below.            
            
               Verification URL: ${verificationURL}`;

        Email.send({
          to: exportingUserEmail,
          from: emailAddress,
          subject:
            "Please confirm your email prior to data export from Huri Whakatau",
          text: emailBody,
        });
      }
    }
  },

  // send all user data to user email as json file
  "users.exportUserData"(userId) {
    const user = Meteor.users.findOne({ _id: userId });
    if (user) {
      const exportingUserEmail = user.emails[0].address;
      const comments = Comments.find({
        $or: [
          { authorId: user._id },
          { emojis: { $elemMatch: { $eq: { users: user._id } } } },
        ],
      }).fetch();

      const ratedCommentInfo = CommentRatings.find({
        ratings: { $elemMatch: { $eq: { userId: user._id } } },
      }).fetch();

      let ratedCommentIds = [];
      ratedCommentInfo.forEach((commentInfo) => {
        ratedCommentIds.push(commentInfo._id);
      });

      const ratedComments = Comments.find({ _id: { $in: ratedCommentIds } })
        .fetch()
        .sort((a, b) => {
          return (
            ratedCommentIds.indexOf(a._id) - ratedCommentIds.indexOf(b._id)
          );
        });

      const authoredVerdicts = Verdicts.find(
        { authorId: user._id },
        { fields: { postedTime: 1, text: 1 } }
      ).fetch();
      const votedVerdicts = Verdicts.find(
        { votes: { $elemMatch: { $eq: { userId: user._id } } } },
        {
          fields: {
            text: 1,
            votes: { $elemMatch: { $eq: { userId: user._id } } },
          },
        }
      ).fetch();

      if (user.profile?.personality !== undefined) {
        user.profile?.personality.forEach((question) => {
          let questionnaire = Personality.findOne({
            _id: question.questionnaireId,
          });
          question.title = questionnaire.questionnaireName;
          question.text = questionnaire.items[question.item - 1].text;
        });
      }

      let userData = `{
                "ProfileDetails": ${JSON.stringify(user, null, 4)},
                "CommentsAuthoredOrInteractedWith":  ${JSON.stringify(
                  comments,
                  null,
                  4
                )},
                “CommentsRated”: ${JSON.stringify(ratedComments, null, 4)},
                "VerdictsProposed" : ${JSON.stringify(
                  authoredVerdicts,
                  null,
                  4
                )},
                "VerdictsVotedOn": ${JSON.stringify(votedVerdicts, null, 4)},
            }`;

      Email.send({
        to: exportingUserEmail,
        from: emailAddress,
        subject: "Data from Huri Whakatau",
        text:
          "Please find attached all the data that has been collected relating to your profile.",
        attachments: [
          {
            // utf-8 string as an attachment
            filename: "User_Data.json",
            content: userData,
          },
        ],
      });
    }
  },

  "users.sendFeedback"(message) {
    Email.send({
      to: emailAddress,
      from: emailAddress,
      subject: "User privacy feedback",
      text: message,
    });
  },

  "users.removeAll"() {
    Meteor.users.remove({});
    console.log('Users.count():', Meteor.users.find().count());
  }
});

if (Meteor.isServer) {
  // Meteor.call("users.exportUserData", "SXz6FTuJ9PdgrhXyo");
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
