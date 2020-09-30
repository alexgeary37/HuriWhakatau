import "/imports/api/topics";
import "/imports/api/groups";
import "/imports/api/scenarios";
import "/imports/api/categories";
import "/imports/api/discussions";
import "/imports/api/scenarioSets";
import "/imports/api/discussionTemplate";
import {Roles} from "meteor/alanning:roles";
import {Meteor} from "meteor/meteor";
import {Groups} from "/imports/api/groups";
import {Scenarios} from "/imports/api/scenarios";
import {Categories} from "../imports/api/categories";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {DiscussionTemplates} from "../imports/api/discussionTemplate"

// set up checks that each item doesn’t exist, if not create, if so then for the ones that might be needed to create other items get their IDs.
if (Meteor.isServer) {
//create categories if the basic set doesn't exist
    let topicId;
    if (Categories.find().count() === 0) {
        Categories.insert({name: "Politics"});
        Categories.insert({name: "Religion"});
        Categories.insert({name: "Philosophy"});
        Categories.insert({name: "Sport"});
        Categories.insert({name: "Science"});
        Categories.insert({name: "Other"});
        Categories.insert({name: "Culture"});
        Categories.insert({name: "Maori Culture"});
        Categories.insert({name: "Maori Affairs"});
    } else {
        topicId = Categories.findOne({name: "Other"});
    }

// Create accounts
    let defaultUsers = [];
    let defaultUser = "";
    if (!Accounts.findUserByUsername("Mary")) {
        defaultUser = Accounts.createUser({
            username: "Mary",
            password: "password1",
        });
        defaultUsers.push(defaultUser);
    } else {
        let username = Accounts.findUserByUsername("Mary")
        console.log("a default user: " + username.username);
        defaultUsers.push(username._id);
    }

    if (!Accounts.findUserByUsername("Gary")) {
        defaultUser = Accounts.createUser({
            username: "Gary",
            password: "password2",
        });
        defaultUsers.push(defaultUser);
    } else {
        defaultUsers.push(Accounts.findUserByUsername("Gary")._id);
    }

    if (!Accounts.findUserByUsername("Daisy")) {
        defaultUser = Accounts.createUser({
            username: "Daisy",
            password: "password3",
        });
        defaultUsers.push(defaultUser);
    } else {
        defaultUsers.push(Accounts.findUserByUsername("Daisy")._id);
    }


//Create group for default users
    if (!Groups.find({name: "Starter group"})) {
        Groups.insert({
            name: "Starter group",
            members: defaultUsers,
            createdAt: new Date(),
            createdBy: "ADMIN",
        })
    }


// Set up discussion Templates:
    if (!DiscussionTemplates.find({name: "Default -Timed"})) {
        const templateId1 = DiscussionTemplates.insert({
            name: "Default -Timed",
            usersAreAnonymous: false,
            showTypingNotification: false,
            usersCanEditComments: true,
            discussionCommentsThreaded: false,
            showProfileInfo: false,
            canAddEmojis: true,
            timeLimit: 0,
            commentCharacterLimit: 0,
            createdAt: new Date(),
            createdBy: "ADMIN",
        });

        const templateId2 = DiscussionTemplates.insert({
            name: "Default - Users Can Edit Comments",
            usersAreAnonymous: false,
            showTypingNotification: false,
            usersCanEditComments: true,
            discussionCommentsThreaded: false,
            showProfileInfo: false,
            canAddEmojis: true,
            timeLimit: 0,
            commentCharacterLimit: 0,
            createdAt: new Date(),
            createdBy: "ADMIN",
        });

        DiscussionTemplates.insert({
            name: "Default - Users Can’t Edit Comments",
            usersAreAnonymous: false,
            showTypingNotification: false,
            usersCanEditComments: false,
            discussionCommentsThreaded: false,
            showProfileInfo: false,
            canAddEmojis: true,
            timeLimit: 0,
            commentCharacterLimit: 0,
            createdAt: new Date(),
            createdBy: "ADMIN",
        });


// create some scenarios
        let scenarios = [];
        scenarios.push(Scenarios.insert({
            title: "Default - Introduction",
            description: "A discussion for group members to get to know each other prior to the scheduled topic driven discussions",
            topicId: topicId,
            discussionTemplateId: templateId1,
            createdAt: new Date(),
            createdBy: "ADMIN",
        }));

        scenarios.push(Scenarios.insert({
            title: "A title that sets up the discussion",
            description: "A deeper description of the topic",
            topicId: topicId,
            discussionTemplateId: templateId2,
            createdAt: new Date(),
            createdBy: "ADMIN",
        }));

//create a scenario set
        ScenarioSets.insert({
            title: "Starter Set",
            description: "Here’s what a scenario set looks like",
            scenarios: scenarios,
            randomise: false,
            createdAt: new Date(),
            createdBy: "ADMIN",
        });
    }

//set up roles if they don't exist
    let createdRoles = Roles.getAllRoles();
    let roleList = [];
    createdRoles.forEach((role) => {
        roleList.push(role._id);
    });
    // console.log(roleList);
//set up roles
    const userRoles = [
        "CREATE_GROUPS",
        "CREATE_SCENARIOS",
        "CREATE_SCENARIOSETS",
        "ADMIN",
        "RESEARCHER",
        "PARTICIPANT_W",
        "PARTICIPANT_I",
        "GROUP_LEADER",
    ];

    userRoles.forEach((role) => {
        if (!roleList.includes(role)) {
            Roles.createRole(role);
        }
        if (["ADMIN", "RESEARCHER"].includes(role)) {
            !Roles.isParentOf(role, "CREATE_SCENARIOS") &&
            Roles.addRolesToParent("CREATE_SCENARIOS", role);
            !Roles.isParentOf(role, "CREATE_GROUPS") &&
            Roles.addRolesToParent("CREATE_GROUPS", role);
            !Roles.isParentOf(role, "CREATE_SCENARIOSETS") &&
            Roles.addRolesToParent("CREATE_SCENARIOSETS", role);
        }
    });
}
