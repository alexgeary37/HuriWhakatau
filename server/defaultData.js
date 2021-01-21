import "/imports/api/topics";
import "/imports/api/groups";
import "/imports/api/scenarios";
import "/imports/api/categories";
import "/imports/api/discussions";
import "/imports/api/scenarioSets";
import "/imports/api/discussionTemplate";
import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";
import { Groups } from "../imports/api/groups";
import { Scenarios } from "../imports/api/scenarios";
import { Categories } from "../imports/api/categories";
import { ScenarioSets } from "../imports/api/scenarioSets";
import { DiscussionTemplates } from "../imports/api/discussionTemplate";
import { Usernames } from "../imports/api/usernames";
import { randomUsernames } from "../imports/api/usernames";
import { Personality } from "../imports/api/personality";
import { newRivers, Rivers } from "../imports/api/rivers";
import { Discussions } from "../imports/api/discussions";
// const Mountains = new Mongo.Collection("mountains");

// set up checks that each item doesn't exist, if not create, if so then for the ones that might be needed to create other items get their IDs.
if (Meteor.isServer) {
  const admin = "ADMIN";
  console.log("Running defaultData.js");

  //create categories if the basic set doesn't exist.
  if (Categories.find().count() === 0) {
    const categoryTitles = ['Politics', 'Religion', 'Philosophy', 'Sport', 'Science', 'Other', 'Te Reo', 'Culture', 'Maori Culture', 'Maori Affairs'];
    for (i = 0; i < categoryTitles.length; i += 1) {
      const category = {title: categoryTitles[i], createdBy: admin};

      // Check category against schema.
      Categories.schema.validate(category);
      if (Categories.schema.isValid()) {
        console.log('Successful validation of category');
        Categories.insert(category);
      } else {
        console.log("validationErrors:", Categories.schema.validationErrors());
      }
    }
  }

  categoryId = Categories.findOne({ title: "Other" })._id;

  // Create accounts
  let defaultUsers = [];
  let defaultUser = "";
  if (!Accounts.findUserByUsername("Mary")) {
    defaultUser = Accounts.createUser({
      username: "Mary",
      password: "password1",
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
          timestamp: 1608533705315.0,
        },
      },
    });
    defaultUsers.push(defaultUser);
  } else {
    const username = Accounts.findUserByUsername("Mary");
    console.log("a default user: " + username.username);
    defaultUsers.push(username._id);
  }

  if (!Accounts.findUserByUsername("Gary")) {
    defaultUser = Accounts.createUser({
      username: "Gary",
      password: "password2",
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
          timestamp: 1608533705315.0,
        },
      },
    });
    defaultUsers.push(defaultUser);
  } else {
    defaultUsers.push(Accounts.findUserByUsername("Gary")._id);
  }

  if (!Accounts.findUserByUsername("Daisy")) {
    defaultUser = Accounts.createUser({
      username: "Daisy",
      password: "password3",
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
          timestamp: 1608533705315.0,
        },
      },
    });
    defaultUsers.push(defaultUser);
  } else {
    defaultUsers.push(Accounts.findUserByUsername("Daisy")._id);
  }

  if (!Accounts.findUserByUsername("Alex")) {
    defaultUser = Accounts.createUser({
      username: "Alex",
      password: "password1",
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
          timestamp: 1608533705315.0,
        },
      },
    });
    defaultUsers.push(defaultUser);
  } else {
    const username = Accounts.findUserByUsername("Alex");
    defaultUsers.push(username._id);
  }

  // Create group for default users.
  const groupName = "Starter group";
  if (!Groups.findOne({ name: groupName })) {
    console.log("Create Starter group");
    console.log(defaultUsers);

    const group = {
      name: groupName,
      members: defaultUsers,
      previousMembers: [],
      createdAt: new Date(),
      createdBy: admin,
    };

    Groups.schema.validate(group);

    if (Groups.schema.isValid()) {
      console.log('Successful validation of group');
      Groups.insert(group);
    } else {
      console.log("validationErrors:", Groups.schema.validationErrors());
    }
  }

  // Set up DiscussionTemplates.
  if (DiscussionTemplates.find({}).count() === 0) {
    console.log("Create Discussion Templates");

    let templateId1, templateId2;

    let discussionTemplate = {
      name: "Default-Timed",
      usersAreAnonymous: false,
      showTypingNotification: false,
      usersCanEditComments: true,
      discussionCommentsThreaded: false,
      showProfileInfo: false,
      canAddEmojis: true,
      timeLimit: 30,
      commentCharacterLimit: 0,
      isHui: false,
      isPublic: false,
      createdAt: new Date(),
      createdBy: admin,
    };

    DiscussionTemplates.schema.validate(discussionTemplate);

    if (DiscussionTemplates.schema.isValid()) {
      console.log('Successful validation of discussionTemplate');
      templateId1 = DiscussionTemplates.insert(discussionTemplate);
    } else {
      console.log("validationErrors:", DiscussionTemplates.schema.validationErrors());
    }

    discussionTemplate = {
      name: "Default - Users Can Edit Comments",
      usersAreAnonymous: false,
      showTypingNotification: false,
      usersCanEditComments: true,
      discussionCommentsThreaded: false,
      showProfileInfo: false,
      canAddEmojis: true,
      timeLimit: 0,
      commentCharacterLimit: 0,
      isHui: false,
      isPublic: false,
      createdAt: new Date(),
      createdBy: admin,
    };

    DiscussionTemplates.schema.validate(discussionTemplate);

    if (DiscussionTemplates.schema.isValid()) {
      console.log('Successful validation of discussionTemplate');
      templateId2 = DiscussionTemplates.insert(discussionTemplate);
    } else {
      console.log("validationErrors:", DiscussionTemplates.schema.validationErrors());
    }

    discussionTemplate = {
      name: "Default - Users Can't Edit Comments",
      usersAreAnonymous: false,
      showTypingNotification: false,
      usersCanEditComments: false,
      discussionCommentsThreaded: false,
      showProfileInfo: false,
      canAddEmojis: true,
      timeLimit: 0,
      commentCharacterLimit: 0,
      isHui: false,
      isPublic: false,
      createdAt: new Date(),
      createdBy: admin,
    };

    DiscussionTemplates.schema.validate(discussionTemplate);

    if (DiscussionTemplates.schema.isValid()) {
      console.log('Successful validation of discussionTemplate');
      DiscussionTemplates.insert(discussionTemplate);
    } else {
      console.log("validationErrors:", DiscussionTemplates.schema.validationErrors());
    }

    // Create Scenarios.
    console.log("Create Scenarios for Discussion Templates");
    let scenarios = [];

    const scenarioTitles = ["Default - Introduction", "A title that sets up the discussion"];
    const scenarioDescriptions = ["A discussion for group members to get to know each other prior to the scheduled topic driven discussions", "A deeper description of the topic"];
    const scenarioTemplates = [templateId1, templateId2];

    for (i = 0; i < scenarioTitles.length; i += 1) {
      const scenario = {
        title: scenarioTitles[i],
        description: scenarioDescriptions[i],
        categoryIds: [categoryId],
        discussionTemplateId: scenarioTemplates[i],
        createdAt: new Date(),
        createdBy: admin
      };

      Scenarios.schema.validate(scenario);

      if (Scenarios.schema.isValid()) {
        console.log('Successful validation of scenario');
        const scenarioId = Scenarios.insert(scenario);
        scenarios.push(scenarioId);
      } else {
        console.log("validationErrors:", Scenarios.schema.validationErrors());
      }
    }

    // Create a ScenarioSet.
    console.log('Create the ScenarioSet "Starter Set"');

    const scenarioSet = {
      title: 'Starter Set',
      description: "Here's what a scenario set looks like",
      scenarios: scenarios,
      randomise: false,
      createdAt: new Date(),
      createdBy: admin
    };

    ScenarioSets.schema.validate(scenarioSet);

    if (ScenarioSets.schema.isValid()) {
      console.log('Successful validation of scenarioSet');
      ScenarioSets.insert(scenarioSet);
    } else {
      console.log("validationErrors:", Scenarios.schema.validationErrors());
    }

    console.log("scenarios::", scenarios);
  }

  //set up roles if they don't exist
  let createdRoles = Roles.getAllRoles();
  let roleList = [];
  createdRoles.forEach((role) => {
    roleList.push(role._id);
  });

  //set up roles
  const userRoles = [
    "CREATE_GROUPS",
    "CREATE_SCENARIOS",
    "CREATE_SCENARIOSETS",
    admin,
    "RESEARCHER",
    "PARTICIPANT_W",
    "PARTICIPANT_I",
    "GROUP_LEADER",
  ];

  userRoles.forEach((role) => {
    if (!roleList.includes(role)) {
      Roles.createRole(role);
    }
    if ([admin, "RESEARCHER"].includes(role)) {
      !Roles.isParentOf(role, "CREATE_SCENARIOS") &&
        Roles.addRolesToParent("CREATE_SCENARIOS", role);
      !Roles.isParentOf(role, "CREATE_GROUPS") &&
        Roles.addRolesToParent("CREATE_GROUPS", role);
      !Roles.isParentOf(role, "CREATE_SCENARIOSETS") &&
        Roles.addRolesToParent("CREATE_SCENARIOSETS", role);
    }
  });

  Roles.addUsersToRoles(
    [
      Accounts.findUserByUsername("Daisy")._id,
      Accounts.findUserByUsername("Mary")._id,
    ],
    [admin]
  );

  // // Create default personality.
  // if (Personality.find().count() === 0) {
  //   const personality = {
  //     questionnaire: "Question"
  //   };

  //   // Check personality against schema.
  //   Personality.schema.validate(personality);

  //   if (Personality.schema.isValid()) {
  //     console.log('Successful validation of personality');
  //     Personality.insert(personality);
  //   } else {
  //     console.log("validationErrors:", Personality.schema.validationErrors());
  //   }
  // }

  // let newMountains = [];
  //
  // newMountains.forEach((mountain) => {
  //     Mountains.insert({name: mountain});
  // })
  // if (Usernames.find({}).count() === 0) {
  //
  //     for (let i = 0; i < randomUsernames.length; i++) {
  //         console.log("here's names", randomUsernames[i]);
  //         Usernames.insert({name: randomUsernames[i]});
  //     }
  // }

  // newRivers.forEach((river) => {
  //         Rivers.insert({name: river});
  //     })
  console.log("Finished running defaultData.js");
}
