import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const DiscussionTemplates = new Mongo.Collection("discussionTemplates");

DiscussionTemplates.schema = new SimpleSchema({
  _id: { type: String, optional: true },
  name: String,
  usersAreAnonymous: Boolean,
  showTypingNotification: Boolean,
  usersCanEditComments: Boolean,
  discussionCommentsThreaded: Boolean,
  showProfileInfo: Boolean,
  canAddEmojis: Boolean,
  timeLimit: Number,
  commentCharacterLimit: Number,
  isHui: Boolean,
  isPublic: Boolean,
  createdAt: Date,
  createdBy: String,
}).newContext();

Meteor.methods({
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
    isHui,
    isPublic
  ) {
    //addcheck for user admin/researcher role

    const discussionTemplate = {
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
      isPublic: isPublic,
      createdAt: new Date(),
      createdBy: Meteor.userId(),
    };

    // Check discussionTemplate against schema.
    DiscussionTemplates.schema.validate(discussionTemplate);
    
    if (DiscussionTemplates.schema.isValid()) {
      DiscussionTemplates.insert(discussionTemplate);
    } else {
      console.log("Validation Errors:", DiscussionTemplates.schema.validationErrors());
    }
  },

  // Remove a discussionTemplate from the discussionTemplates collection in the db.
  "discussionTemplates.remove"(discussionTemplateId) {
    check(discussionTemplateId, String);
    // add role check

    DiscussionTemplates.remove(discussionTemplateId);
  },

  "discussionTemplates.removeAll"() {
    DiscussionTemplates.remove({});
  }
});

if (Meteor.isServer) {
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
          isPublic: 1,
          createdAt: 1,
          createdBy: 1,
        },
      }
    );
  });
}
