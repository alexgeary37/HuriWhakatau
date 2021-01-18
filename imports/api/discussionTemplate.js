import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import SimpleSchema from "simpl-schema";

export const DiscussionTemplates = new Mongo.Collection("discussionTemplates");

DiscussionTemplates.schema = new SimpleSchema({
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
});

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
    check(isPublic, Boolean);
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
    
    DiscussionTemplates.insert(discussionTemplate);
  },

  // Remove a category from the categories collection in the db.
  // categoryId: _id of the comment to be removed
  // Called from Discussion.jsx
  "discussionTemplates.remove"(discussionTemplateId) {
    check(discussionTemplateId, String);
    //add role check

    DiscussionTemplates.remove(discussionTemplateId);
  },

  "discussionTemplates.removeAll"() {
    DiscussionTemplates.remove({});
  }
});

if (Meteor.isServer) {
  if(!process.env.MONGO_URL.includes("juryroom_admin")){
    console.log("minimongo discussion templates", process.env.MONGO_URL);
  } else {
    console.log("not minimongo discussion templates");
  }

  const templates = DiscussionTemplates.find({}).fetch();
  for (i = 0; i < templates.length; i += 1) {
    console.log(templates[i]);
  }

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
