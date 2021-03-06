import "/imports/api/topics";
import "/imports/api/groups";
import "/imports/api/scenarios";
import "/imports/api/categories";
import "/imports/api/discussions";
import "/imports/api/scenarioSets";
import "/imports/api/discussionTemplates";
import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";
import { Groups } from "../imports/api/groups";
import { Scenarios } from "../imports/api/scenarios";
import { Categories } from "../imports/api/categories";
import { ScenarioSets } from "../imports/api/scenarioSets";
import { DiscussionTemplates } from "../imports/api/discussionTemplates";
import { Usernames, randomUsernames } from "../imports/api/usernames";
import { Personality } from "../imports/api/personality";
import { newRivers, Rivers } from "../imports/api/rivers";
import { Mountains } from "../imports/api/mountains";

// set up checks that each item doesn't exist, if not create, if so then for the ones that might be needed to create other items get their IDs.
if (Meteor.isServer) {
  const admin = "ADMIN";

  //create categories if the basic set doesn't exist.
  if (Categories.find().count() === 0) {
    const categoryTitles = ['Politics', 'Religion', 'Philosophy', 'Sport', 'Science', 'Other', 'Te Reo', 'Culture', 'Maori Culture', 'Maori Affairs'];
    for (i = 0; i < categoryTitles.length; i += 1) {
      const category = {title: categoryTitles[i], createdBy: admin};

      // Check category against schema.
      Categories.schema.validate(category);
      if (Categories.schema.isValid()) {
        Categories.insert(category);
      } else {
        console.log("Validation Errors:", Categories.schema.validationErrors());
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

    const group = {
      name: groupName,
      members: defaultUsers,
      previousMembers: [],
      createdAt: new Date(),
      createdBy: admin,
    };

    Groups.schema.validate(group);

    if (Groups.schema.isValid()) {
      Groups.insert(group);
    } else {
      console.log("Validation Errors:", Groups.schema.validationErrors());
    }
  }

  // Set up DiscussionTemplates.
  if (DiscussionTemplates.find({}).count() === 0) {
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
      templateId1 = DiscussionTemplates.insert(discussionTemplate);
    } else {
      console.log("Validation Errors:", DiscussionTemplates.schema.validationErrors());
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
      templateId2 = DiscussionTemplates.insert(discussionTemplate);
    } else {
      console.log("Validation Errors:", DiscussionTemplates.schema.validationErrors());
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
      DiscussionTemplates.insert(discussionTemplate);
    } else {
      console.log("Validation Errors:", DiscussionTemplates.schema.validationErrors());
    }

    // Create Scenarios.
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
        const scenarioId = Scenarios.insert(scenario);
        scenarios.push(scenarioId);
      } else {
        console.log("Validation Errors:", Scenarios.schema.validationErrors());
      }
    }

    // Create a ScenarioSet.
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
      ScenarioSets.insert(scenarioSet);
    } else {
      console.log("Validation Errors:", Scenarios.schema.validationErrors());
    }
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

  // Create default personality.
  if (Personality.find().count() === 0) {
    const personality = {
      questionnaireName: "Question",
      paperDoi: "doi",
      items: [
        {
          item: 1,
          text: "item text",
          scale: 2,
          scoringReversed: false,
          responseType: "Frequency"
        }
      ]
    };

    Personality.schema.validate(personality);

    if (Personality.schema.isValid()) {
      Personality.insert(personality);
    } else {
      console.log("Validation Errors:", Personality.schema.validationErrors());
    }
  }

  // Create default mountains.
  if (Mountains.find().count() === 0) {
    const mountain = {
      name: "mountain"
    };

    Mountains.schema.validate(mountain);

    if (Mountains.schema.isValid()) {
      Mountains.insert(mountain);
    } else {
      console.log("Validation Errors:", Mountains.schema.validationErrors());
    }
  }

  // Create default rivers.
  if (Rivers.find().count() === 0) {

    newRivers.forEach((river) => {
      const document = {
        name: river
      };
  
      Rivers.schema.validate(document);
  
      if (Rivers.schema.isValid()) {
        Rivers.insert(document);
      } else {
        console.log("Validation Errors:", Rivers.schema.validationErrors());
      }
    });
  }

  if (Usernames.find({}).count() === 0) {
    randomUsernames.forEach((username) => {
      const document = {
        name: username
      }

      Usernames.schema.validate(document);

      if (Usernames.schema.isValid()) {
        Usernames.insert(document);
      } else {
        console.log("Validation Errors:", Usernames.schema.validationErrors());
      }
    });
  }
}