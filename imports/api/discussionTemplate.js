import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const DiscussionTemplates = new Mongo.Collection("discussionTemplates");

Meteor.methods({
  // Insert a category into the category collection in the db.
  // name: the category name
  // Called from *****
  "discussionTemplates.create"(
    name,
    usersAreAnonymous,
    showTypingNotification,
    usersCanEditComments,
    discussionCommentsThreaded,
    showProfileInfo,
    canAddEmojis,
    timeLimit,
    commentCharacterLimit,
    isHui
  ) {
    check(name, String);
    check(usersAreAnonymous, Boolean);
    check(showTypingNotification, Boolean);
    check(usersCanEditComments, Boolean);
    check(discussionCommentsThreaded, Boolean);
    check(showProfileInfo, Boolean);
    check(canAddEmojis, Boolean);
    check(timeLimit, Number);
    check(commentCharacterLimit, Number);
    check(isHui, Boolean);
    //addcheck for user admin/researcher role

    DiscussionTemplates.insert({
      name: name,
      usersAreAnonymous: usersAreAnonymous,
      showTypingNotification: showTypingNotification,
      usersCanEditComments: usersCanEditComments,
      discussionCommentsThreaded: discussionCommentsThreaded,
      showProfileInfo: showProfileInfo,
      canAddEmojis: canAddEmojis,
      timeLimit: timeLimit,
      commentCharacterLimit: commentCharacterLimit,
      isHui: isHui,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
    });
  },

  // Remove a category from the categories collection in the db.
  // categoryId: _id of the comment to be removed
  // Called from Discussion.jsx
  "discussionTemplates.remove"(discussionTemplateId) {
    check(discussionTemplateId, String);
    //add role check

    DiscussionTemplates.remove(discussionTemplateId);
  },
});

if (Meteor.isServer) {
  // DiscussionTemplates.remove({});

  Meteor.publish("discussionTemplates", function () {
    return DiscussionTemplates.find(
      {},
      {
        fields: {
          name: 1,
          usersAreAnonymous: 1,
          showTypingNotification: 1,
          usersCanEditComments: 1,
          discussionCommentsThreaded: 1,
          showProfileInfo: 1,
          canAddEmojis: 1,
          timeLimit: 1,
          commentCharacterLimit: 1,
          isHui: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
