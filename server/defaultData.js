import "/imports/api/topics";
import "/imports/api/groups";
import "/imports/api/scenarios";
import "/imports/api/categories";
import "/imports/api/discussions";
import "/imports/api/scenarioSets";
import "/imports/api/discussionTemplate";
import {Roles} from "meteor/alanning:roles";
import {Meteor} from "meteor/meteor";
import {Groups} from "../imports/api/groups";
import {Topics} from "../imports/api/topics";
import {Scenarios} from "../imports/api/scenarios";
import {Categories} from "../imports/api/categories";
import {ScenarioSets} from "../imports/api/scenarioSets";
import {DiscussionTemplates} from "../imports/api/discussionTemplate"

// const Mountains = new Mongo.Collection("mountains");

// set up checks that each item doesn’t exist, if not create, if so then for the ones that might be needed to create other items get their IDs.
if (Meteor.isServer) {
    //create topics if not exist
    if(Topics.find().count() === 0){
        //add some default discussion topics here, like Tamahau's ones
    }
//create categories if the basic set doesn't exist
    let categoryId;
    if (Categories.find().count() === 0) {
        Categories.insert({title: "Politics"});
        Categories.insert({title: "Religion"});
        Categories.insert({title: "Philosophy"});
        Categories.insert({title: "Sport"});
        Categories.insert({title: "Science"});
        Categories.insert({title: "Other"});
        Categories.insert({title: "Te reo"});
        Categories.insert({title: "Culture"});
        Categories.insert({title: "Maori Culture"});
        Categories.insert({title: "Maori Affairs"});
    } else {
        categoryId = Categories.findOne({title: "Other"});
    }

// Create accounts
    let defaultUsers = [];
    let defaultUser = "";
    if (!Accounts.findUserByUsername("Mary")) {
        defaultUser = Accounts.createUser({
            username: "Mary",
            password: "password1",
            pepeha: {
                mountain:"",
                river:"",
                waka:"",
                iwi:"",
                role:"",
            },
            userDetails:{
                firstName:"",
                lastName:"",
                ethnicity:"",
                location:"",
                gender:"",
                dob:"",
                religion:"",
            }
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
            pepeha: {
                mountain:"",
                river:"",
                waka:"",
                iwi:"",
                role:"",
            },
            userDetails:{
                firstName:"",
                lastName:"",
                ethnicity:"",
                location:"",
                gender:"",
                dob:"",
                religion:"",
            }
        });
        defaultUsers.push(defaultUser);
    } else {
        defaultUsers.push(Accounts.findUserByUsername("Gary")._id);
    }

    if (!Accounts.findUserByUsername("Daisy")) {
        defaultUser = Accounts.createUser({
            username: "Daisy",
            password: "password3",
            pepeha: {
                mountain:"",
                river:"",
                waka:"",
                iwi:"",
                role:"",
            },
            userDetails:{
                firstName:"",
                lastName:"",
                ethnicity:"",
                location:"",
                gender:"",
                dob:"",
                religion:"",
            }
        });
        defaultUsers.push(defaultUser);
    } else {
        defaultUsers.push(Accounts.findUserByUsername("Daisy")._id);
    }
    if (!Accounts.findUserByUsername("Alex")) {
        defaultUser = Accounts.createUser({
            username: "Alex",
            password: "password1",
            pepeha: {
                mountain:"",
                river:"",
                waka:"",
                iwi:"",
                role:"",
            },
            userDetails:{
                firstName:"",
                lastName:"",
                ethnicity:"",
                location:"",
                gender:"",
                dob:"",
                religion:"",
            }
        });
        defaultUsers.push(defaultUser);
    } else {
        let username = Accounts.findUserByUsername("Alex")
        defaultUsers.push(username._id);
    }

    console.log("undefined group: ", !Groups.findOne({name: "Starter group"})._id);
//Create group for default users
    if (!Groups.findOne({name: "Starter group"})._id) {
        console.log("group method");
        console.log(defaultUsers);
        Groups.insert({
            name: "Starter group",
            members: defaultUsers,
            createdAt: new Date(),
            createdBy: "ADMIN",
        })
    }

console.log("discid", !DiscussionTemplates.findOne({name: "Default -Timed"})._id);
// Set up discussion Templates:
    if (!DiscussionTemplates.findOne({name: "Default -Timed"})._id) {
        const templateId1 = DiscussionTemplates.insert({
            name: "Default -Timed",
            usersAreAnonymous: false,
            showTypingNotification: false,
            usersCanEditComments: true,
            discussionCommentsThreaded: false,
            showProfileInfo: false,
            canAddEmojis: true,
            timeLimit: 30,
            commentCharacterLimit: 0,
            isHui: false,
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
            isHui: false,
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
            isHui: false,
            createdAt: new Date(),
            createdBy: "ADMIN",
        });


// create some scenarios
        let scenarios = [];
        scenarios.push(Scenarios.insert({
            title: "Default - Introduction",
            description: "A discussion for group members to get to know each other prior to the scheduled topic driven discussions",
            categoryId: categoryId,
            discussionTemplateId: templateId1,
            createdAt: new Date(),
            createdBy: "ADMIN",
        }));

        scenarios.push(Scenarios.insert({
            title: "A title that sets up the discussion",
            description: "A deeper description of the topic",
            categoryId: categoryId,
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
        console.log(scenarios);

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

    Roles.addUsersToRoles([Accounts.findUserByUsername("Daisy")._id,
        Accounts.findUserByUsername("Mary")._id], ["ADMIN"]);
    // let newMountains = [];
    //
    // newMountains.forEach((mountain) => {
    //     Mountains.insert({name: mountain});
    // })

}
