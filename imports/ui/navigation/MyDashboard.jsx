import {useTracker} from "meteor/react-meteor-data";
import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    Container,
    Segment,
    Header,
    Grid,
    GridColumn, GridRow, ListItem, Sidebar, Menu, Icon, List, Rating
} from "semantic-ui-react";
import NotificationBadge from "react-notification-badge";
import '/imports/api/security'
import {NavBar} from "./NavBar";
import {CreateGroup} from "../groups/CreateGroup";
import {UserSummary} from "../users/UserSummary";
import {GroupSummary} from "/imports/ui/groups/GroupSummary";
import {CreateScenario} from "../scenarios/CreateScenario";
import {ScenarioSummary} from "/imports/ui/scenarios/ScenarioSummary";
import {CreateExperiment} from "../experiments/CreateExperiment";
import {DiscussionSummary} from "/imports/ui/discussions/DiscussionSummary";
import {ExperimentSummary} from "/imports/ui/experiments/ExperimentSummary";
import {CreateScenarioSet} from "../scenarioSets/CreateScenarioSet";
import {ScenarioSetSummary} from "/imports/ui/scenarioSets/ScenarioSetSummary";
import {CreateDiscussion} from "/imports/ui/discussions/CreateDiscussion";
import {CreateDiscussionTemplate} from "/imports/ui/discussionTemplates/CreateDiscussionTemplate";
import {DiscussionTemplateSummary} from "/imports/ui/discussionTemplates/DiscussionTemplateSummary";
import {DisplayDiscussionTemplate} from "/imports/ui/discussionTemplates/DisplayDiscussionTemplate";
import {Link} from "react-router-dom";
import {Users} from "/imports/api/users"
import {Groups} from "/imports/api/groups";
import {Scenarios} from "/imports/api/scenarios";
import {Experiments} from "/imports/api/experiments";
import {Discussions} from "/imports/api/discussions";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";

export const MyDashboard = () => {
    const [showInfo, setShowInfo] = useState(true);
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
        console.log(result);
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
        friends
    } = useTracker(() => {
        //subscribe to roles for user permissions check, should this be ^^ up there?
        let fetchedDiscussionTemplates = null;
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
        let currentUser;

        let userId = Meteor.userId();
        if(userSub.ready()) {
            currentUser = Meteor.users.findOne({_id: userId});
            if(currentUser.friends) {
                fetchedFriendIds = currentUser.friends;
                fetchedFriendIds.forEach((friendId) => {
                    fetchedFriends.push(Meteor.users.findOne({_id: friendId}));
                })
            }
        }

        let fetchedGroups = Groups.find({members: {$elemMatch: {$eq: userId}}}).fetch(); //,
        let fetchedScenarios = Scenarios.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedScenarioSets = ScenarioSets.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        fetchedDiscussionTemplates = DiscussionTemplates.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedExperiments = Experiments.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,

        // need to handle case where user has no groups or discussions yet.
        let groupIds = [];
        for (let i = 0; i < fetchedGroups.length; i++) {
            groupIds.push(fetchedGroups[i]._id);
        }
        let fetchedAllFinishedDiscussions = Discussions.find({status: {$ne: "active"}}, {sort: {createdAt: -1}}).fetch();
        let fetchedMyDiscussions = Discussions.find({$or: [{groupId: {$in: groupIds}}, {createdBy: userId}]}, {
            sort: {
                createdAt: -1,
                status: 1
            }
        }).fetch();

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
        };
    });

    const handleShowSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    return (
        <div>
            <NavBar/>
            <span style={{height: "10em"}}/>
            {/*start sidebar*/}
            <Sidebar.Pushable as={Segment}>
                <Sidebar
                    as={Segment}
                    animation='overlay'
                    icon='labeled'
                    inverted
                    vertical
                    visible
                    width={showSidebar ? "thin" : "very thin"}
                >

                    <Menu.Item onClick={handleShowSidebar}>
                        <Icon size={'big'} name='users' />
                        Friends
                    </Menu.Item>
                    {showSidebar && friends && friends.map((friend) => (
                        <Menu.Item key={friend._id} >
                            {friend.username}
                            <Rating icon='star' defaultRating={!friend.online ? 1 : 0} maxRating={1} disabled />
                        </Menu.Item>
                    ))}
                </Sidebar>

                <Sidebar.Pusher>
                {/*end sidebar*/}
            <Container>

                <Segment attached="top" clearing>
                    <Header size="huge">
                        <Header.Content as={Container} fluid>
                            My Dashboard {isAdmin && <span>- Admin</span>}
                            {isAdmin &&
                            <Button
                                floated="right"
                                onClick={() => {
                                    handleToggleWizard();
                                    handleToggleGroup();
                                }}
                                content="Open Experiment Wizard"
                                color="green"
                            />}
                        </Header.Content>
                    </Header>
                </Segment>

                <Grid doubling style={{overflow: "auto", height: "87vh"}}>
                    <GridRow columns={2}>
                        <GridColumn width={8}>
                            <Segment fluid style={{height: "21em"}}>
                                <Header as={'h3'}>My Discussions <Button
                                    floated={"right"}
                                    onClick={handleToggleDiscussion}
                                    content="New Discussion"
                                    positive
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
                            <Segment fluid style={{height: "21em"}}>
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
                            <Segment fluid style={{height: "21em"}}>
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
                                        positive
                                    />}
                                </Card.Content>
                            </Segment>
                        </GridColumn>
                        {isAdmin &&
                        <>
                            <GridColumn width={6}>
                                <Segment fluid style={{height: "21em"}}>
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
                                            positive
                                        />
                                    </Card.Content>
                                </Segment>
                            </GridColumn>
                            <GridColumn width={5}>
                                <Segment fluid style={{height: "21em"}}>
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
                                            positive
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
                            <Segment style={{height: "21em"}}>
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
                                        positive
                                    />
                                </Card.Content>
                            </Segment>
                        </GridColumn>
                        <GridColumn width={6}>
                            <Segment style={{height: "21em"}}>
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
                                        positive
                                    />
                                </Card.Content>
                            </Segment>
                        </GridColumn>
                        <GridColumn width={5}>
                            <Segment style={{height: "21em"}}>
                                <Header as={'h3'}>Add Users to roles</Header>
                                <Button
                                    fluid
                                    content="Assign Roles"
                                    as={Link}
                                    to="/assignroles"
                                    positive
                                />
                                <br/>
                                <Button
                                    fluid
                                    content="Add user"
                                    as={Link}
                                    to="/AddUser"
                                    positive
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
                {/* Item display modals */}
                {isOpenTemplateDisplay &&
                <DisplayDiscussionTemplate
                    toggleModal={handleToggleTemplateDisplay}
                    template={template}/>
                }

            </Container>
            </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
};
