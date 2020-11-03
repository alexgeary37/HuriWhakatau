import {useTracker} from "meteor/react-meteor-data";
import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    Container,
    Segment,
    Header,
    Grid,
    GridColumn, GridRow, ListItem, Sidebar, Menu, Icon, List, Rating, Input
} from "semantic-ui-react";
import '/imports/api/security'
import {Link} from "react-router-dom";
import {Groups} from "/imports/api/groups";
import {Scenarios} from "/imports/api/scenarios";
import {Experiments} from "/imports/api/experiments";
import {Discussions} from "/imports/api/discussions";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {NavBar} from "./NavBar";
import {CreateGroup} from "../groups/CreateGroup";
import {GroupSummary} from "/imports/ui/groups/GroupSummary";
import {CreateScenario} from "../scenarios/CreateScenario";
import {ScenarioSummary} from "/imports/ui/scenarios/ScenarioSummary";
import {CreateDiscussion} from "/imports/ui/discussions/CreateDiscussion";
import {CreateExperiment} from "../experiments/CreateExperiment";
import {DiscussionSummary} from "/imports/ui/discussions/DiscussionSummary";
import {ExperimentSummary} from "/imports/ui/experiments/ExperimentSummary";
import {CreateScenarioSet} from "../scenarioSets/CreateScenarioSet";
import {ScenarioSetSummary} from "/imports/ui/scenarioSets/ScenarioSetSummary";
import {CreateDiscussionTemplate} from "/imports/ui/discussionTemplates/CreateDiscussionTemplate";
import {DiscussionTemplateSummary} from "/imports/ui/discussionTemplates/DiscussionTemplateSummary";
import {DisplayDiscussionTemplate} from "/imports/ui/discussionTemplates/DisplayDiscussionTemplate";


export const MyDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isResearcher, setIsResearcher] = useState(false);
    const [isIndigenous, setIsIndigenous] = useState(null);
    const [isOpenWizard, setIsOpenWizard] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isOpenTemplateCreation, setIsOpenTemplateCreation] = useState(false);
    const [isOpenScenarioCreation, setIsOpenScenarioCreation] = useState(false);
    const [isOpenScenarioSetCreation, setIsOpenScenarioSetCreation] = useState(false);
    const [isOpenExperimentCreation, setIsOpenExperimentCreation] = useState(false);
    const [isOpenGroupCreation, setIsOpenGroupCreation] = useState(false);
    const [isOpenTemplateDisplay, setIsOpenTemplateDisplay] = useState(false);
    const [isOpenDiscussionCreation, setIsOpenDiscussionCreation] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [foundFriendsList, setFoundFriendsList] = useState([]);
    const [haveFoundFriends, setHaveFoundFriends] = useState(true);
    const [friendEmail, setFriendEmail] = useState("");
    const [friendInviteError, setFriendInviteError] = useState("");
    const [template, setTemplate] = useState(null);
    const handleToggleWizard = () => {
        setIsOpenWizard(!isOpenWizard);
    }
    //is there a more abstracted way to handle all these modal open/closes?
    const handleToggleTemplate = () => {
        setIsOpenTemplateCreation(!isOpenTemplateCreation);
    }
    const handleToggleScenario = () => {
        setIsOpenScenarioCreation(!isOpenScenarioCreation);
    }
    const handleToggleScenarioSet = () => {
        setIsOpenScenarioSetCreation(!isOpenScenarioSetCreation);
    }
    const handleToggleExperimentCreation = () => {
        setIsOpenExperimentCreation(!isOpenExperimentCreation);
    }
    const handleToggleTemplateDisplay = (template) => {
        setTemplate(template); // template is undefined. make async
        setIsOpenTemplateDisplay(!isOpenTemplateDisplay);
    }
    const handleToggleGroup = () => {
        setIsOpenGroupCreation(!isOpenGroupCreation);
    }
    const handleToggleDiscussion = () => {
        setIsOpenDiscussionCreation(!isOpenDiscussionCreation);
    }

    //get user admin role status and update isAdmin variable with call back.
    // possibly this should be a Promise?
    Meteor.call("security.hasRole", Meteor.userId(), "ADMIN", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        setIsAdmin(result);
    });
    //get user researcher role status and update isResearcher variable with call back.
    // possibly this should be a Promise?
    Meteor.call("security.hasRole", Meteor.userId(), "RESEARCHER", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        setIsResearcher(result);
    });
    //get user indigenous role status and update isIndigenous variable with call back.
    Meteor.call("security.hasRole", Meteor.userId(), "PARTICIPANT_I", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        setIsIndigenous(result);
    });

    const {
        user,
        myDiscussions,
        allFinishedDiscussions,
        groups,
        scenarios,
        scenarioSets,
        discussionTemplates,
        experiments,
        friends,
        pendingFriends,
        groupMembers,
        anyFriendOnline,
        anyGroupMemberOnline,
    } = useTracker(() => {
        //subscribe to roles for user permissions check, should this be ^^ up there?
        // let fetchedDiscussionTemplates = null;
        Meteor.subscribe("roles");
        Meteor.subscribe("allDiscussions");
        Meteor.subscribe("groups");
        Meteor.subscribe("scenarios");
        Meteor.subscribe("scenarioSets");
        Meteor.subscribe("discussionTemplates");
        Meteor.subscribe("experiments");
        const userSub = Meteor.subscribe("users");
        let fetchedFriendIds = [];
        let fetchedFriends = [];
        let fetchedPendingFriendIds = [];
        let fetchedPendingFriends = [];
        let fetchedGroupMemberIds = [];
        let fetchedGroupMembers = [];
        let currentUser;
        let groupIds = [];
        let userId = Meteor.userId();
        let fetchedGroups = Groups.find({members: {$elemMatch: {$eq: userId}}}).fetch(); //,
        let fetchedScenarios = Scenarios.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedScenarioSets = ScenarioSets.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedDiscussionTemplates = DiscussionTemplates.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedExperiments = Experiments.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedAllFinishedDiscussions = Discussions.find({status: {$ne: "active"}}, {sort: {createdAt: -1}}).fetch();
        // need to handle case where user has no groups or discussions yet.
        for (let i = 0; i < fetchedGroups.length; i++) {
            groupIds.push(fetchedGroups[i]._id);
        }
        let fetchedMyDiscussions = Discussions.find({$or: [{groupId: {$in: groupIds}}, {createdBy: userId}]}, {
            sort: {
                createdAt: -1,
                status: 1
            }
        }).fetch();

        //once user collection subscription ready and there is a logged in user, find user
        // and get friends and users that the user is in groups with
        if (userSub.ready() && userId) {
            currentUser = Meteor.users.findOne({_id: userId});
            if (currentUser.friendList) {
                fetchedFriendIds = currentUser.friendList;
                fetchedFriendIds.forEach((friendId) => {
                    fetchedFriends.push(Meteor.users.findOne({_id: friendId}, {fields: { username: 1, online: 1}}));
                })
            }

            if (currentUser.pendingFriendList) {
                fetchedPendingFriendIds = currentUser.pendingFriendList;
                fetchedPendingFriendIds.forEach((pendingFriendId) => {
                    fetchedPendingFriends.push(Meteor.users.findOne({_id: pendingFriendId}, {fields: { username: 1}}));
                })
            }

            //add all member ids for each group the user is part of to a total, filter out the user themselves
            fetchedGroups.forEach((group) => {
                fetchedGroupMemberIds.push(...group.members.filter(id => id !== userId));
            })

            // remove duplicate values
            fetchedGroupMemberIds = new Set(fetchedGroupMemberIds);

            // find the users and add to array
            fetchedGroupMemberIds.forEach((memberId) => {
                fetchedGroupMembers.push(Meteor.users.findOne({_id: memberId}, {fields: { username: 1}}));
            })
        }

        return {
            user: currentUser,
            myDiscussions: fetchedMyDiscussions,
            allFinishedDiscussions: fetchedAllFinishedDiscussions,
            groups: fetchedGroups,
            scenarios: fetchedScenarios,
            scenarioSets: fetchedScenarioSets,
            discussionTemplates: fetchedDiscussionTemplates,
            experiments: fetchedExperiments,
            friends: fetchedFriends,
            pendingFriends: fetchedPendingFriends,
            groupMembers: fetchedGroupMembers,
            anyFriendOnline: fetchedFriends.some(friend => friend.online === true),
            anyGroupMemberOnline: fetchedGroupMembers.some(member => member.online === true),
        };
    });

    const handleShowSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    const submitFriendSearch = () => {
        setIsSearching(true);
        setHaveFoundFriends(true);
        Meteor.call("users.findFriend", searchTerm, (err, response) => {
            setFoundFriendsList(response);
            setIsSearching(false);
            setSearchTerm("");
            if (response.length === 0) {
                setHaveFoundFriends(false);
            }
        });
    }

    const addFriend = (friendId) => {
        Meteor.call("users.addPendingFriend", friendId, Meteor.userId(), (_, response) => {
            if (response){
                let filteredFriendsList = foundFriendsList.filter(function( friend ) {
                    return friend._id !== friendId;
                });
                setFoundFriendsList([...filteredFriendsList]);
            }
        });
    }

    const acceptFriend = (friendId) => {
        Meteor.call("users.removePendingFriend", Meteor.userId(), friendId, (_, response) => {
            if (response){
                Meteor.call("users.addFriend", Meteor.userId(), friendId)
                Meteor.call("users.addFriend", friendId, Meteor.userId())
            }
        });
    }

    const declineFriend = (friendId) => {
        Meteor.call("users.removePendingFriend", Meteor.userId(), friendId);
    }

    const inviteFriend = () => {
        Meteor.call("users.inviteFriend", friendEmail, (err, _) => {
            if (err) {
                setFriendInviteError(err);
            }
        });
        setFriendEmail("");
    }

    const searchFriendsComponent = () => {
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <Input
                    style={{marginTop: '10px'}}
                    type="text"
                    placeholder="Username or email"
                    name="searchFriends"
                    fluid
                    focus
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                />
                <Button fluid onClick={submitFriendSearch} icon labelPosition='right'>
                    Search
                    <Icon name={!isSearching ? 'right arrow' : 'loading circle notch'}/>
                </Button>
            </div>
        );
    }

    const inviteFriendsComponent = () => {
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <h3>Sorry No friends found, invite one!</h3>
                <Input
                    style={{marginTop: '10px'}}
                    type="text"
                    placeholder="email address"
                    name="inviteFriends"
                    fluid
                    focus
                    onChange={(e) => setFriendEmail(e.currentTarget.value)}
                />
                <Button fluid onClick={inviteFriend} icon labelPosition='right'>
                    Invite
                    <Icon name={'envelope'}/>
                </Button>
            </div>
        );
    }

    return (
        <div>
            <NavBar/>
            <Sidebar.Pushable as={Segment} style={{height: 'auto', backgroundColor: 'rgb(30, 30, 30)'}} >
                {/* right sidebar */}
                <Sidebar
                    as={Segment}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    vertical
                    visible
                    width={showSidebar ? "wide" : "very thin"}
                    onClick={handleShowSidebar}
                    style={{
                        backgroundColor: 'rgb(30, 30, 30)',
                        backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,
                        backgroundSize: '60px',
                        backgroundRepeat: 'repeat-y'
                    }}
                >
                    {/*my friends*/}
                    <Menu.Item title={anyFriendOnline ? 'there are friends online' : 'no friends online'}>
                        <Icon size={'big'} name='users'/>
                        {anyFriendOnline &&
                        <Rating icon='star' defaultRating={1} maxRating={1} disabled/>
                        }
                        <br/>
                        Friends
                    </Menu.Item>
                    <List style={{height: "15em"}}>
                        {showSidebar && friends && friends.map((friend) => (
                            <Menu.Item key={friend._id} title={friend.online ? 'online' : 'offline'}>
                                {friend.username}
                                <Rating icon='star' defaultRating={friend.online ? 1 : 0} maxRating={1} disabled/>
                            </Menu.Item>
                        ))}
                        {showSidebar && pendingFriends && pendingFriends.map((pendingFriend) => (
                            <Menu.Item key={pendingFriend._id} /*title={pendingFriend.online ? 'online' : 'offline'}*/>
                                {pendingFriend.username}
                                <Button negative size={'mini'} compact={true} onClick={() => acceptFriend(pendingFriend._id)}>
                                    ACCEPT
                                </Button>
                                <Button negative size={'mini'} compact={true} onClick={() => declineFriend(pendingFriend._id)}>
                                    DECLINE
                                </Button>
                            </Menu.Item>
                        ))}
                    </List>
                    {showSidebar && foundFriendsList && <div onClick={(e) => e.stopPropagation()}>
                        {foundFriendsList.map((potentialFriend) => (
                            <Menu.Item key={potentialFriend._id}>
                                <span style={{
                                    paddingLeft: '15px',
                                    paddingRight: '20px'
                                }}>{potentialFriend.username}</span>
                                <Button negative size={'mini'} compact={true} attached={'right'} onClick={() => addFriend(potentialFriend._id)}>
                                    ADD
                                </Button>
                            </Menu.Item>
                        ))}</div>}
                    {showSidebar && !haveFoundFriends && inviteFriendsComponent()}
                    {showSidebar && searchFriendsComponent()}
                    {/*my group members, update to have a group member specific user set*/}
                    <Menu.Item title={anyGroupMemberOnline ? 'there are members online' : 'no members online'}>
                        <Icon size={'big'} name='users'/>
                        {anyGroupMemberOnline &&
                        <Rating icon='star' defaultRating={1} maxRating={1} disabled/>
                        }
                        <br/>
                        Group Members
                    </Menu.Item>
                    <List style={{height: "15em"}}>
                        {showSidebar && groupMembers && groupMembers.map((groupMember) => (
                            <Menu.Item key={groupMember._id} title={groupMember.online ? 'online' : 'offline'}>
                                {groupMember.username}
                                <Rating icon='star' defaultRating={groupMember.online ? 1 : 0} maxRating={1} disabled/>
                            </Menu.Item>
                        ))}
                    </List>
                </Sidebar>
                {/* right sidebar */}
                <Sidebar
                    as={Segment}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    vertical
                    direction={'right'}
                    visible
                    width={"very thin"}
                    style={{
                        backgroundColor: 'rgb(30, 30, 30)',
                        backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,
                        backgroundSize: '60px',
                        backgroundRepeat: 'repeat-y'
                    }}
                />
                {/*end sidebar*/}
                <Sidebar.Pusher style={{backgroundColor: 'rgb(10, 10, 10)'}} dimmed={showSidebar} onClick={showSidebar ? handleShowSidebar : null}>

                    <Container>
                        <span style={{height: "22em"}}/>
                        <Segment attached="top" clearing inverted
                                 style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
                            <Header size="huge">
                                <Header.Content as={Container}>
                                    My Dashboard {isAdmin && <span>- Admin</span>}
                                    {isAdmin &&
                                    <Button
                                        floated="right"
                                        onClick={() => {
                                            handleToggleWizard();
                                            handleToggleGroup();
                                        }}
                                        content="Open Experiment Wizard"
                                        negative
                                    />}
                                </Header.Content>
                            </Header>
                        </Segment>

                        <Grid doubling style={{overflow: "auto", height: "87vh"}}>
                            <GridRow columns={2}>
                                <GridColumn width={8}>
                                    <Segment style={{height: "21em"}} inverted
                                             style={{backgroundColor: 'rgb(10, 10, 10)'}}
                                             title={!user ? "please sign-up or login to create a new discussion" : "Create a new discussion"}
                                    >
                                        <Header as={'h3'}>My Discussions
                                            <Button
                                                floated={"right"}
                                                onClick={handleToggleDiscussion}
                                                content="New Discussion"
                                                disabled={!user}
                                                negative
                                                compact
                                            />
                                        </Header>

                                        {/* attempting to only load this when user
                                role is known and render with correct link path*/}
                                        {(isIndigenous !== null) &&
                                        <ListItem style={{overflow: "auto", height: "16em"}}
                                                  description={myDiscussions &&
                                                  myDiscussions.map((discussion) => (
                                                      <DiscussionSummary
                                                          key={discussion._id}
                                                          discussion={discussion}
                                                          participantRole={isIndigenous}
                                                      />
                                                  ))}/>}
                                        <Card.Content extra>
                                        </Card.Content>
                                    </Segment>
                                </GridColumn>
                                <GridColumn width={8}>
                                    <Segment style={{height: "21em"}} inverted
                                             style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                        <Header as={'h3'}>All Finished Discussions</Header>
                                        <ListItem style={{overflow: "auto", height: "16em"}}
                                                  description={allFinishedDiscussions &&
                                                  allFinishedDiscussions.map((discussion) => (
                                                      <DiscussionSummary
                                                          key={discussion._id}
                                                          discussion={discussion}
                                                          participantRole={true}
                                                      />
                                                  ))}/>
                                        <Card.Content extra>
                                        </Card.Content>
                                    </Segment>
                                </GridColumn>
                            </GridRow>
                            <GridRow columns={3}>
                                <GridColumn width={5}>
                                    <Segment style={{height: "21em", backgroundColor: 'rgb(10, 10, 10)'}} inverted>
                                        <Header as={'h3'}>My Groups</Header>
                                        <ListItem style={{overflow: "auto", height: "13em"}}
                                                  description={groups &&
                                                  groups.map((group) => (
                                                      <GroupSummary
                                                          key={group._id}
                                                          group={group}
                                                      />
                                                  ))}/>
                                        <Card.Content extra style={{margin: "1em"}}>
                                            {isAdmin &&
                                            <Button
                                                fluid
                                                onClick={handleToggleGroup}
                                                content="Create New Group"
                                                basic
                                                negative
                                            />}
                                        </Card.Content>
                                    </Segment>
                                </GridColumn>
                                {isAdmin &&
                                <>
                                    <GridColumn width={6}>
                                        <Segment style={{height: "21em"}} inverted
                                                 style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                            <Header as={'h3'}>My Discussion Templates</Header>
                                            <ListItem style={{overflow: "auto", height: "13em"}}
                                                      description={discussionTemplates &&
                                                      discussionTemplates.map((discussionTemplate) => (
                                                          <DiscussionTemplateSummary
                                                              key={discussionTemplate._id}
                                                              template={discussionTemplate}
                                                              toggleModal={handleToggleTemplateDisplay}
                                                          />
                                                      ))}
                                            />
                                            <Card.Content extra style={{margin: "1em"}}>
                                                <Button
                                                    fluid
                                                    onClick={handleToggleTemplate}
                                                    content="Create New Template"
                                                    basic
                                                    negative
                                                />
                                            </Card.Content>
                                        </Segment>
                                    </GridColumn>
                                    <GridColumn width={5}>
                                        <Segment style={{height: "21em"}} inverted
                                                 style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                            <Header as={'h3'}>My scenarios</Header>
                                            <ListItem style={{overflow: "auto", height: "13em"}}
                                                      description={scenarios &&
                                                      scenarios.map((scenario) => (
                                                          <ScenarioSummary
                                                              key={scenario._id}
                                                              scenario={scenario}
                                                          />
                                                      ))}/>
                                            <Card.Content extra style={{margin: "1em"}}>
                                                <Button
                                                    fluid
                                                    onClick={handleToggleScenario}
                                                    content="Create New"
                                                    basic
                                                    negative
                                                />
                                            </Card.Content>
                                        </Segment>
                                    </GridColumn>
                                </>
                                }
                            </GridRow>
                            {isAdmin &&
                            <GridRow columns={3}>

                                <GridColumn width={5}>
                                    <Segment style={{height: "21em"}} inverted
                                             style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                        <Header as={'h3'}>My Scenario Sets</Header>
                                        <ListItem style={{overflow: "auto", height: "13em"}}
                                                  description={scenarioSets &&
                                                  scenarioSets.map((scenarioSet) => (
                                                      <ScenarioSetSummary
                                                          key={scenarioSet._id}
                                                          scenarioSet={scenarioSet}
                                                      />
                                                  ))}/>
                                        <Card.Content extra style={{margin: "1em"}}>
                                            <Button
                                                fluid
                                                onClick={handleToggleScenarioSet}
                                                content="Create New Set"
                                                basic
                                                negative
                                            />
                                        </Card.Content>
                                    </Segment>
                                </GridColumn>
                                <GridColumn width={6}>
                                    <Segment style={{height: "21em"}} inverted
                                             style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                        <Header as={'h3'}>My Experiments</Header>
                                        <ListItem style={{overflow: "auto", height: "13em"}}
                                                  description={experiments &&
                                                  experiments.map((experiment) => (
                                                      <ExperimentSummary
                                                          key={experiment._id}
                                                          experiment={experiment}
                                                      />
                                                  ))}/>
                                        <Card.Content extra style={{margin: "1em"}}>
                                            <Button
                                                fluid
                                                onClick={handleToggleExperimentCreation}
                                                content="Create New Experiment"
                                                basic
                                                negative
                                            />
                                        </Card.Content>
                                    </Segment>
                                </GridColumn>
                                <GridColumn width={5}>
                                    <Segment style={{height: "21em"}} inverted
                                             style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                        <Header as={'h3'}>Add Users to roles</Header>
                                        <Button
                                            fluid
                                            content="Assign Roles"
                                            as={Link}
                                            to="/assignroles"
                                            basic
                                            negative
                                        />
                                        <br/>
                                        <Button
                                            fluid
                                            content="Add user"
                                            as={Link}
                                            to="/AddUser"
                                            basic
                                            negative
                                        />
                                    </Segment>
                                </GridColumn>
                            </GridRow>
                            }
                        </Grid>
                        {/*    Modals    */}
                        {isOpenGroupCreation &&
                        <CreateGroup toggleModal={handleToggleGroup}
                                     isWizard={isOpenWizard}
                                     toggleNextModal={handleToggleScenario}
                                     toggleIsWizard={handleToggleWizard}/>}

                        {isOpenScenarioCreation &&
                        <CreateScenario
                            toggleModal={handleToggleScenario}
                            isWizard={isOpenWizard}
                            toggleNextModal={handleToggleScenarioSet}
                            toggleIsWizard={handleToggleWizard}/>
                        }
                        {isOpenScenarioSetCreation &&
                        <CreateScenarioSet
                            toggleModal={handleToggleScenarioSet}
                            isWizard={isOpenWizard}
                            toggleNextModal={handleToggleExperimentCreation}
                            toggleIsWizard={handleToggleWizard}/>
                        }
                        {isOpenTemplateCreation &&
                        <CreateDiscussionTemplate
                            toggleModal={handleToggleTemplate}
                            isWizard={isOpenWizard}
                            toggleNextModal={handleToggleExperimentCreation}
                            toggleIsWizard={handleToggleWizard}/>
                        }
                        {isOpenExperimentCreation &&
                        <CreateExperiment
                            toggleModal={handleToggleExperimentCreation}
                            isWizard={isOpenWizard}
                            // toggleNextModal={handleToggleScenarioSet}
                            toggleIsWizard={handleToggleWizard}/>
                        }
                        {isOpenDiscussionCreation &&
                        <CreateDiscussion
                            toggleModal={handleToggleDiscussion}
                        />
                        }
                    </Container>
                </Sidebar.Pusher>
            </Sidebar.Pushable>

        </div>
    );
};
