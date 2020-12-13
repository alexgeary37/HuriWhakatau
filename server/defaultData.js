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
import {Scenarios} from "../imports/api/scenarios";
import {Categories} from "../imports/api/categories";
import {ScenarioSets} from "../imports/api/scenarioSets";
import {DiscussionTemplates} from "../imports/api/discussionTemplate"
import {Personality} from "../imports/api/personality";
// const Mountains = new Mongo.Collection("mountains");


// set up checks that each item doesn't exist, if not create, if so then for the ones that might be needed to create other items get their IDs.
if (Meteor.isServer) {
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
                }
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
                }
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
                }
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
                }
            }
        });
        defaultUsers.push(defaultUser);
    } else {
        let username = Accounts.findUserByUsername("Alex")
        defaultUsers.push(username._id);
    }

    //console.log("undefined group: ", !Groups.findOne({name: "Starter group"})._id);
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
            createdAt: new Date(),
            createdBy: "ADMIN",
        });


// create some scenarios
        let scenarios = [];
        scenarios.push(Scenarios.insert({
            title: "Default - Introduction",
            description: "A discussion for group members to get to know each other prior to the scheduled topic driven discussions",
            categoryIds: [categoryId],
            discussionTemplateId: templateId1,
            createdAt: new Date(),
            createdBy: "ADMIN",
        }));

        scenarios.push(Scenarios.insert({
            title: "A title that sets up the discussion",
            description: "A deeper description of the topic",
            categoryIds: [categoryId],
            discussionTemplateId: templateId2,
            createdAt: new Date(),
            createdBy: "ADMIN",
        }));

//create a scenario set
        ScenarioSets.insert({
            title: "Starter Set",
            description: "Here's what a scenario set looks like",
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

    // Personality.insert({
    //     questionnaireName: "Revised Dogmatism Scale",
    //     paperDoi: "10.1080/01463370600877950",
    //     items: [
    //         {
    //             item: 1,
    //             text: "There is a clear line between what is right and what is wrong.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //         {
    //             itemNumber: 2,
    //             question: "People who disagree with me are usually wrong.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //         {
    //             item: 3,
    //             question: "Having multiple perspectives on an issue is usually desirable.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //         {
    //             item: 4,
    //             question: "I'm the type of person who questions authority.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 5,
    //             question: "When I disagree with someone else, I think it is perfectly acceptable to agree to disagree.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 6,
    //             question: "I am confident in the correctness of my beliefs.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 7,
    //             question: "There is a single correct way to do most things.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 8,
    //             question: "People should respect authority.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 9,
    //             question: "I am a person who is strongly committed to my beliefs.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 10,
    //             question: "Diversity of opinion and background is valuable in any group or organization.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 11,
    //             question: "It is important to be open to different points of view.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 12,
    //             question: 'I am a "my way or the highway" type of person.',
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 13,
    //             question: "I will not compromise on the things that are really important to me.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 14,
    //             question: "There are often many different acceptable ways to solve a problem.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 15,
    //             question: "I consider myself to be very open-minded.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 16,
    //             question: "Few things in life are truly black and white; instead I see gray areas on most topics.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 17,
    //             question: "Different points of views should be encouraged.",
    //             scale: 5,
    //             scoringReversed: true,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 18,
    //             question: "People who are in a position of authority have the right to tell others what to do.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 19,
    //             question: "People who are very different from us can be dangerous.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 20,
    //             question: 'I am "set in my ways."',
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 21,
    //             question: "When I make a decision, I stick with it.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 22,
    //             question: "It is usually wise to seek out expert opinions before making decisions.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         },
    //
    //         {
    //             item: 23,
    //             question: "I like having a set routine.",
    //             scale: 5,
    //             scoringReversed: false,
    //             responseType: "Accuracy",
    //         }
    //     ],
    // })
}
