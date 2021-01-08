import {useTracker} from "meteor/react-meteor-data";
import React, {useEffect, useState, Suspense, lazy} from "react";
import {
    Button, Card, Container, Segment, Header, Grid,
    GridColumn, GridRow, ListItem, Sidebar, Menu, Icon, List, Rating, Input, Divider, Checkbox
} from "semantic-ui-react";
import '/imports/api/security'
import {Link} from "react-router-dom";
import {Groups} from "/imports/api/groups";
import {Scenarios} from "/imports/api/scenarios";
import {Experiments} from "/imports/api/experiments";
import {Discussions} from "/imports/api/discussions";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {siteGlossary} from "../../api/glossary";
import {myDashParticipant, myDashResearcher} from "/imports/api/tourSteps"
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {NavBar} from "./NavBar";
import {Tour} from "./Tour";
import {CreateGroup} from "../groups/CreateGroup";
import {GroupSummary} from "/imports/ui/groups/GroupSummary";
import {CreateScenario} from "../scenarios/CreateScenario";
import {RatingComponent} from "./RatingComponent";
// const ScenarioSummary = lazy(() => import("/imports/ui/scenarios/ScenarioSummary"));
import {ScenarioSummary} from "/imports/ui/scenarios/ScenarioSummary";
import {CreateDiscussion} from "/imports/ui/discussions/CreateDiscussion";
import {CreateExperiment} from "../experiments/CreateExperiment";
import {DiscussionSummary} from "/imports/ui/discussions/DiscussionSummary";
import {ExperimentSummary} from "/imports/ui/experiments/ExperimentSummary";
import {CreateScenarioSet} from "../scenarioSets/CreateScenarioSet";
import {ScenarioSetSummary} from "/imports/ui/scenarioSets/ScenarioSetSummary";
import {CreateDiscussionTemplate} from "/imports/ui/discussionTemplates/CreateDiscussionTemplate";
import {DiscussionTemplateSummary} from "/imports/ui/discussionTemplates/DiscussionTemplateSummary";
import NotificationBadge from "react-notification-badge";
import Cookies from "universal-cookie/lib";
import {Layout} from "./Layout";

export const MyDashboard = () => {
    const cookies = new Cookies();
    // const [userLang, setUserLang] = useState("mā");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isResearcher, setIsResearcher] = useState(false);
    const [isIndigenous, setIsIndigenous] = useState(null);
    const [isOpenWizard, setIsOpenWizard] = useState(false);
    // const [showSidebar, setShowSidebar] = useState(false);
    const [showTour, setShowTour] = useState(false);
    const [isOpenTemplateCreation, setIsOpenTemplateCreation] = useState(false);
    const [isOpenScenarioCreation, setIsOpenScenarioCreation] = useState(false);
    const [isOpenScenarioSetCreation, setIsOpenScenarioSetCreation] = useState(false);
    const [isOpenExperimentCreation, setIsOpenExperimentCreation] = useState(false);
    const [isOpenGroupCreation, setIsOpenGroupCreation] = useState(false);
    const [isOpenTemplateDisplay, setIsOpenTemplateDisplay] = useState(false);
    const [isOpenDiscussionCreation, setIsOpenDiscussionCreation] = useState(false);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [isSearching, setIsSearching] = useState(false);
    // const [foundFriendsList, setFoundFriendsList] = useState([]);
    // const [haveFoundFriends, setHaveFoundFriends] = useState(true);
    // const [friendEmail, setFriendEmail] = useState("");
    // const [errFriendEmail, setErrFriendEmail] = useState("");
    // const [friendInviteError, setFriendInviteError] = useState("");
    const [template, setTemplate] = useState(null);
    const [isDiscussionListsHidden, setIsDiscussionListsHidden] = useState(false);
    const [filterDiscussionStatus, setFilterDiscussionStatus] = useState(["active"]);
    const participantTourSteps = myDashParticipant;
    const researcherTourSteps = myDashResearcher;
    // handles user language selection for page, how to centralise this code so it doesn't get repeated every page?
    // const handleChangeLanguage = (lang) => {
    //     setUserLang(lang);
    // }
    // // set lang om load from cookie if exists.
    // useEffect(() => {
    //     if (cookies.get('lang')) {
    //         setUserLang(cookies.get('lang'))
    //     } else {
    //         cookies.set('lang', "mā", {path: '/'});
    //     }
    //     document.title = "My Dashboard";
    // }, []);

    useEffect(()=>{document.title = "My Dashboard"},[])

    const toggleShowTour = () => {
        if (!cookies.get('myDashTour')) {
            setShowTour(!showTour);
        }
    }

    useEffect(() => {
        toggleShowTour();
    }, []);

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
    Meteor.call("security.hasRole", Meteor.userId(), "ADMIN", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        setIsAdmin(result);
    });
    //get user researcher role status and update isResearcher variable with call back.
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
        // friends,
        // pendingFriends,
        // groupMembers,
        // anyFriendOnline,
        // anyGroupMemberOnline,
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
        let userSub = Meteor.subscribe("users");
        // let friendsOnline;
        // let groupMembersOnline;
        // let fetchedFriendIds = [];
        // let fetchedFriends = [];
        // let fetchedPendingFriendIds = [];
        // let fetchedPendingFriends = [];
        // let fetchedGroupMemberIds = [];
        // let fetchedGroupMembers = [];
        // let currentUser = Meteor.users.findOne({_id: Meteor.userId()});
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

        // once user collection subscription ready and there is a logged in user, find user
        // and get friends and users that the user is in groups with
        // if (currentUser?.profile?.friendList){
        //         if (currentUser.profile.friendList) {
        //             fetchedFriendIds = [...currentUser.profile.friendList];
        //             fetchedFriendIds.forEach((friendId) => {
        //                 fetchedFriends.push(Meteor.users.findOne({_id: friendId}, {fields: {username: 1, status: 1}}));
        //             })
        //         }
        //
        //         if(fetchedFriends[0] !== undefined){
        //             friendsOnline = fetchedFriends.some(friend => friend.status.online === true)
        //         }
        //
        //         if (currentUser.profile.pendingFriendList) {
        //             fetchedPendingFriendIds = currentUser.profile.pendingFriendList;
        //             fetchedPendingFriendIds.forEach((pendingFriendId) => {
        //                 fetchedPendingFriends.push(Meteor.users.findOne({_id: pendingFriendId}, {fields: {username: 1}}));
        //             })
        //         }

        //add all member ids for each group the user is part of to a total, filter out the user themselves
        // fetchedGroups.forEach((group) => {
        //     fetchedGroupMemberIds.push(...group.members.filter(id => id !== userId));
        // });

        // remove duplicate values
        // fetchedGroupMemberIds = new Set(fetchedGroupMemberIds);

        // find the users and add to array
        // fetchedGroupMemberIds.forEach((memberId) => {
        //     fetchedGroupMembers.push(Meteor.users.findOne({_id: memberId}, {fields: {username: 1, status: 1}}));
        // });

        // if(fetchedGroupMembers[0] !== undefined){
        //     groupMembersOnline = fetchedGroupMembers.some(member => member.status.online === true);
        // }
        // }
        return {
            user: Meteor.userId(),
            myDiscussions: fetchedMyDiscussions,
            allFinishedDiscussions: fetchedAllFinishedDiscussions,
            groups: fetchedGroups,
            scenarios: fetchedScenarios,
            scenarioSets: fetchedScenarioSets,
            discussionTemplates: fetchedDiscussionTemplates,
            experiments: fetchedExperiments,
            // friends: fetchedFriends,
            // pendingFriends: fetchedPendingFriends,
            // groupMembers: fetchedGroupMembers,
            // anyFriendOnline: friendsOnline,
            // anyGroupMemberOnline: groupMembersOnline,
        };
    });

    // const handleShowSidebar = () => {
    //     setShowSidebar(!showSidebar);
    // }

    // const submitFriendSearch = () => {
    //     if (searchTerm) {
    //         setIsSearching(true);
    //         setHaveFoundFriends(true);
    //         Meteor.call("users.findFriend", searchTerm, (err, response) => {
    //             setFoundFriendsList(response);
    //             setIsSearching(false);
    //             setSearchTerm("");
    //             if (response.length === 0) {
    //                 setHaveFoundFriends(false);
    //             }
    //         });
    //     }
    // }
    //
    // const addFriend = (friendId) => {
    //     Meteor.call("users.addPendingFriend", friendId, Meteor.userId(), (_, response) => {
    //         if (response) {
    //             let filteredFriendsList = foundFriendsList.filter(function (friend) {
    //                 return friend._id !== friendId;
    //             });
    //             setFoundFriendsList([...filteredFriendsList]);
    //         }
    //     });
    // }
    //
    // const acceptFriend = (friendId) => {
    //     Meteor.call("users.removePendingFriend", Meteor.userId(), friendId, (_, response) => {
    //         if (response) {
    //             Meteor.call("users.addFriend", Meteor.userId(), friendId)
    //             Meteor.call("users.addFriend", friendId, Meteor.userId())
    //         }
    //     });
    // }
    //
    // const declineFriend = (friendId) => {
    //     Meteor.call("users.removePendingFriend", Meteor.userId(), friendId);
    // }
    //
    // const inviteFriend = () => {
    //     if (friendEmail) {
    //         setFriendInviteError("")
    //         Meteor.call("users.inviteFriend", friendEmail, (err, _) => {
    //             if (err) {
    //                 setFriendInviteError(err.reason);
    //             }
    //         });
    //         setFriendEmail("");
    //     } else {
    //         setFriendInviteError("Must be a valid email address")
    //     }
    // }
    //
    // const searchFriendsComponent = () => {
    //     return (
    //         <div style={{marginLeft: "10px", width: "40vh"}} onClick={(e) => e.stopPropagation()}>
    //             <Input
    //                 style={{marginTop: '10px', width:240}}
    //                 type="text"
    //                 placeholder="Username or email"
    //                 name="searchFriends"
    //                 fluid
    //                 focus
    //                 value={searchTerm}
    //                 /*onChange={(e) => setSearchTerm(e.currentTarget.value)}*/
    //                 onChange={(e) => {
    //                     e.currentTarget.value.indexOf("@") > 0
    //                         ? setFriendEmail(e.currentTarget.value) : null;
    //                     setSearchTerm(e.currentTarget.value);
    //                 }}
    //             />
    //             <Button onClick={submitFriendSearch} icon labelPosition='right'>
    //                 Search
    //                 <Icon loading={isSearching} name={!isSearching ? 'right arrow' : 'circle notch'}/>
    //             </Button>
    //             <Button onClick={inviteFriend} icon labelPosition='right'>
    //                 Invite
    //                 <Icon name={'envelope'}/>
    //             </Button>
    //         </div>
    //     );
    // }
    //
    // const inviteFriendsComponent = () => {
    //     return (
    //         <div onClick={(e) => e.stopPropagation()}>
    //             <h3>Sorry No friends found, invite one!</h3>
    //         </div>
    //     );
    // }

    const toggleDiscussionLists = () => {
        setIsDiscussionListsHidden(!isDiscussionListsHidden);
    }

    const setDiscussionFilterOnStatus = (e) => {
        if (e) {
            setFilterDiscussionStatus(["active"])
        } else {
            setFilterDiscussionStatus(["finished", "hung", "timedout"])
        }
    }

    const myDashboardPageContent = (userLang) => {
        return (
            <Container textAlign='left'>
                {showTour &&
                <Tour TOUR_STEPS={isAdmin ? participantTourSteps.concat(researcherTourSteps) : participantTourSteps}/>
                }
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

                <Grid stackable>
                    <GridRow columns={isDiscussionListsHidden ? 1 : 2}>
                        <GridColumn width={16}>
                            <Divider/>
                            <Header as={Link} to={'/mydashboard'} floated='right' inverted
                                    onClick={toggleDiscussionLists}>
                                {isDiscussionListsHidden ? 'Show' : 'Hide'} Discussions</Header>
                            <br/>
                            {isDiscussionListsHidden && <Divider/>}
                        </GridColumn>
                        <GridColumn width={8}>
                            <Segment style={{height: "23em"}} inverted hidden={isDiscussionListsHidden}
                                     style={{backgroundColor: 'rgb(10, 10, 10)'}}
                                     title={!user ? "please sign-up or login to create a new discussion" : "Create a new discussion"}
                            >
                                <Header as={'h3'}
                                        className={'myDiscussions'}>My {siteGlossary.userDiscourse[userLang]}
                                    <Button
                                        className={'newDiscussion'}
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
                                {isIndigenous !== null &&
                                <ListItem style={{overflow: "auto", height: "16em", minWidth: "300px"}}
                                          description={myDiscussions &&
                                          myDiscussions.filter((discussion) => filterDiscussionStatus.indexOf(discussion.status) > -1).map((discussion) => (
                                              <DiscussionSummary
                                                  key={discussion._id}
                                                  discussion={discussion}
                                                  participantRole={isIndigenous}
                                              />
                                          ))}/>}
                                <Card.Content extra>
                                    <Checkbox
                                        toggle
                                        id={'filterActive'}
                                        checked={filterDiscussionStatus.indexOf("active") > -1}
                                        onClick={(e, data) => setDiscussionFilterOnStatus(data.checked)}/>
                                    <label style={{color: "white", marginLeft: "10px"}}
                                           for={'filterActive'}>Show {filterDiscussionStatus.indexOf("active") > -1 ? "finished" : "active"}</label>
                                </Card.Content>
                            </Segment>
                        </GridColumn>
                        <GridColumn width={8}>
                            <Segment style={{height: "23em"}} inverted hidden={isDiscussionListsHidden}
                                     style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                <Header as={'h3'} className={'finishedDiscussions'}>
                                    All Finished {siteGlossary.userDiscourse[userLang]}</Header>
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
                                <Header as={'h3'} className={'myGroups'}>My Groups</Header>
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
                                    <Header as={'h3'} className={'discussionTemplates'}>My Discussion
                                        Templates</Header>
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
                                    <Header as={'h3'} className={'myScenarios'}>My scenarios</Header>
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
                                            content="Create New Scenario"
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
                                <Header as={'h3'} className={'myScenarioSets'}>My Scenario Sets</Header>
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
                                <Header as={'h3'} className={'myExperiments'}>My Experiments</Header>
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
                    <GridRow>
                        <GridColumn width={8}>
                            <Segment style={{height: "21em"}} inverted
                                     style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                                <RatingComponent/>
                            </Segment>
                        </GridColumn>
                    </GridRow>
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
        );
    }

    return (
        // <Segment
        //     inverted
        //     textAlign='center'
        //     style={{minHeight: 800, padding: '1em 0em'}}
        //     vertical
        // >
        //     <NavBar handleChangeLanguage={handleChangeLanguage}/>
        //     <Sidebar.Pushable as={Segment} style={{height: 'auto', backgroundColor: 'rgb(30, 30, 30)'}}>
                <Layout page={myDashboardPageContent}/>
        //         {/* right sidebar */}
        //         {/*<Sidebar*/}
        //         {/*    as={Segment}*/}
        //         {/*    animation='overlay'*/}
        //         {/*    className={(showSidebar ? "custom wide" : "very thin") + ' friends'}*/}
        //         {/*    icon='labeled'*/}
        //         {/*    // inverted*/}
        //         {/*    vertical*/}
        //         {/*    visible*/}
        //         {/*    // width={showSidebar ? "wide" : "very thin"}*/}
        //         {/*    onMouseOver={!showSidebar ? handleShowSidebar : null}*/}
        //         {/*    onClick={handleShowSidebar}*/}
        //         {/*    style={{*/}
        //         {/*        backgroundColor:"#f4f3f5"*/}
        //         {/*        // backgroundColor: 'rgb(30, 30, 30)',*/}
        //         {/*        // backgroundImage: !showSidebar ? `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})` : '',*/}
        //         {/*        // backgroundSize: '60px',*/}
        //         {/*        // backgroundRepeat: 'repeat-y'*/}
        //         {/*    }}*/}
        //         {/*>*/}
        //         {/*    <Icon size={'big'} name={(showSidebar ? 'left':'right') + ' arrow alternate circle'} style={{marginTop:"-10px",marginLeft:(showSidebar ? "220px":"35px")}}/>*/}
        //         {/*    /!*my friends*!/*/}
        //         {/*    <Menu.Item style={{marginTop:"20px", marginLeft: "10px", fontWeight: "bold"}}*/}
        //         {/*               title={anyFriendOnline ? 'There are friends online' : 'No friends online'}>*/}
        //         {/*        <Icon size={'large'} name='users'/>*/}
        //         {/*        {anyFriendOnline && !showSidebar &&*/}
        //         {/*        <Rating icon='star' defaultRating={1} maxRating={1} disabled/>*/}
        //         {/*        }*/}
        //         {/*        <br/>*/}
        //         {/*        Friends*/}
        //         {/*    </Menu.Item>*/}
        //         {/*    <Divider/>*/}
        //         {/*    <List style={{height: "15em"}}>*/}
        //         {/*        {showSidebar && friends && friends.map((friend) => (*/}
        //         {/*            <Menu.Item style={{marginLeft: "20px"}} key={friend._id}*/}
        //         {/*                       title={friend.status.online ?*/}
        //         {/*                           friend.status.idle ? 'idle' : 'online' : 'offline'}>*/}
        //         {/*                <div style={{*/}
        //         {/*                    display: 'inline-block',*/}
        //         {/*                    fontSize: "13pt"*/}
        //         {/*                }}>{friend.username}<NotificationBadge*/}
        //         {/*                    key={friend._id}*/}
        //         {/*                    count={1}*/}
        //         {/*                    effect={[null, null, null, null]}*/}
        //         {/*                    style={{*/}
        //         {/*                        color: friend.status.online ? friend.status.idle ? "yellow" : "green" : "red",*/}
        //         {/*                        backgroundColor: friend.status.online ? friend.status.idle ? "yellow" : "green" : "red",*/}
        //         {/*                        top: "-15px",*/}
        //         {/*                        left: "",*/}
        //         {/*                        bottom: "",*/}
        //         {/*                        right: "-20px",*/}
        //         {/*                        fontSize: "7px",*/}
        //         {/*                        padding: "3px 5px",*/}
        //         {/*                    }}*/}
        //         {/*                /></div>*/}
        //         {/*                /!*<Rating icon='star' defaultRating={friend.status.online ? 1 : 0} maxRating={1} disabled/>*!/*/}
        //         {/*            </Menu.Item>*/}
        //         {/*        ))}*/}
        //         {/*    </List>*/}
        //         {/*    <List>*/}
        //         {/*        {showSidebar && pendingFriends && pendingFriends.map((pendingFriend) => (*/}
        //         {/*            <Menu.Item*/}
        //         {/*                key={pendingFriend._id} */}
        //         {/*                {pendingFriend.username}*/}
        //         {/*                <Button negative size={'mini'} compact={true}*/}
        //         {/*                        onClick={() => acceptFriend(pendingFriend._id)}>*/}
        //         {/*                    ACCEPT*/}
        //         {/*                </Button>*/}
        //         {/*                <Button negative size={'mini'} compact={true}*/}
        //         {/*                        onClick={() => declineFriend(pendingFriend._id)}>*/}
        //         {/*                    DECLINE*/}
        //         {/*                </Button>*/}
        //         {/*            </Menu.Item>*/}
        //         {/*        ))}*/}
        //         {/*    </List>*/}
        //         {/*    {showSidebar && foundFriendsList && <div onClick={(e) => e.stopPropagation()}>*/}
        //         {/*        {foundFriendsList.map((potentialFriend) => (*/}
        //         {/*            <Menu.Item key={potentialFriend._id}>*/}
        //         {/*                <span style={{*/}
        //         {/*                    paddingLeft: '15px',*/}
        //         {/*                    paddingRight: '20px'*/}
        //         {/*                }}>{potentialFriend.username}</span>*/}
        //         {/*                <Button negative size={'mini'} compact={true} attached={'right'}*/}
        //         {/*                        onClick={() => addFriend(potentialFriend._id)}>*/}
        //         {/*                    Request Friend*/}
        //         {/*                </Button>*/}
        //         {/*            </Menu.Item>*/}
        //         {/*        ))}</div>}*/}
        //         {/*    {showSidebar && !haveFoundFriends && inviteFriendsComponent()}*/}
        //         {/*    {showSidebar && searchFriendsComponent()}*/}
        //         {/*    {showSidebar && friendInviteError && <div style={{color:'red', fontWeight: 'bold'}}>*/}
        //         {/*        &nbsp;&nbsp;&nbsp;{friendInviteError}</div>}*/}
        //         {/*    /!*my group members, update to have a group member specific user set*!/*/}
        //         {/*    <Menu.Item style={{marginLeft: "10px", fontWeight: "bold"}} title={anyGroupMemberOnline ?*/}
        //         {/*        'There are members online' : 'No members online'}>*/}
        //         {/*        <Icon size={'large'} name='users'/>*/}
        //         {/*        {anyGroupMemberOnline && !showSidebar &&*/}
        //         {/*        <Rating icon='star' defaultRating={1} maxRating={1} disabled/>*/}
        //         {/*        }*/}
        //         {/*        <br/>*/}
        //         {/*        Group Members*/}
        //         {/*    </Menu.Item>*/}
        //         {/*    <Divider/>*/}
        //         {/*    <List style={{height: "15em"}}>*/}
        //         {/*        {showSidebar && groupMembers && groupMembers.map((groupMember) => (*/}
        //         {/*            <Menu.Item style={{marginLeft: "20px"}} key={groupMember._id}*/}
        //         {/*                       title={groupMember.status.online ?*/}
        //         {/*                           groupMember.status.idle ? 'idle' : 'online' : 'offline'}>*/}
        //         {/*                <div style={{*/}
        //         {/*                    display: 'inline-block',*/}
        //         {/*                    fontSize: "13pt"*/}
        //         {/*                }}>{groupMember.username}<NotificationBadge*/}
        //         {/*                    key={groupMember._id}*/}
        //         {/*                    count={1}*/}
        //         {/*                    effect={[null, null, null, null]}*/}
        //         {/*                    style={{*/}
        //         {/*                        color: groupMember.status.online ? groupMember.status.idle ? "yellow" : "green" : "red",*/}
        //         {/*                        backgroundColor: groupMember.status.online ? groupMember.status.idle ? "yellow" : "green" : "red",*/}
        //         {/*                        top: "-15px",*/}
        //         {/*                        left: "",*/}
        //         {/*                        bottom: "",*/}
        //         {/*                        right: "-20px",*/}
        //         {/*                        fontSize: "7px",*/}
        //         {/*                        padding: "3px 5px",*/}
        //         {/*                    }}*/}
        //         {/*                /></div>*/}
        //         {/*                /!*<Rating icon='star' defaultRating={groupMember.status.online ? 1 : 0} maxRating={1} disabled/>*!/*/}
        //         {/*            </Menu.Item>*/}
        //         {/*        ))}*/}
        //         {/*    </List>*/}
        //         {/*</Sidebar>*/}
        //         {/*/!* right sidebar *!/*/}
        //         {/*<Sidebar*/}
        //         {/*    as={Segment}*/}
        //         {/*    animation='overlay'*/}
        //         {/*    icon='labeled'*/}
        //         {/*    inverted*/}
        //         {/*    vertical*/}
        //         {/*    direction={'right'}*/}
        //         {/*    visible*/}
        //         {/*    width={"very thin"}*/}
        //         {/*    style={{*/}
        //         {/*        backgroundColor: 'rgb(30, 30, 30)',*/}
        //         {/*        backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,*/}
        //         {/*        backgroundSize: '60px',*/}
        //         {/*        backgroundRepeat: 'repeat-y'*/}
        //         {/*    }}*/}
        //         {/*/>*/}
        //         {/*/!*end sidebar*!/*/}
        //         {/*<Sidebar.Pusher style={{backgroundColor: 'rgb(10, 10, 10)', overflow: "auto", height: "92vh"}} dimmed={showSidebar}*/}
        //         {/*                onClick={showSidebar ? handleShowSidebar : null}>*/}
        //
        //         {/*<Container>*/}
        //         {/*    <span style={{height: "10em"}}/>*/}
        //         {/*    <Segment attached="top" clearing inverted*/}
        //         {/*             style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>*/}
        //         {/*        <Header size="huge">*/}
        //         {/*            <Header.Content as={Container}>*/}
        //         {/*                My Dashboard {isAdmin && <span>- Admin</span>}*/}
        //         {/*                {isAdmin &&*/}
        //         {/*                <Button*/}
        //         {/*                    floated="right"*/}
        //         {/*                    onClick={() => {*/}
        //         {/*                        handleToggleWizard();*/}
        //         {/*                        handleToggleGroup();*/}
        //         {/*                    }}*/}
        //         {/*                    content="Open Experiment Wizard"*/}
        //         {/*                    negative*/}
        //         {/*                />}*/}
        //         {/*            </Header.Content>*/}
        //         {/*        </Header>*/}
        //         {/*    </Segment>*/}
        //
        //         {/*    <Grid stackable >*/}
        //         {/*        <GridRow columns={isDiscussionListsHidden ? 1 : 2}>*/}
        //         {/*            <GridColumn width={16}>*/}
        //         {/*                <Divider/>*/}
        //         {/*                <Header as={Link} to={'/mydashboard'} floated='right' inverted*/}
        //         {/*                        onClick={toggleDiscussionLists}>*/}
        //         {/*                    {isDiscussionListsHidden ? 'Show' : 'Hide'} Discussions</Header>*/}
        //         {/*                <br/>*/}
        //         {/*                {isDiscussionListsHidden && <Divider/>}*/}
        //         {/*            </GridColumn>*/}
        //         {/*            <GridColumn width={8}>*/}
        //         {/*                <Segment style={{height: "23em"}} inverted hidden={isDiscussionListsHidden}*/}
        //         {/*                         style={{backgroundColor: 'rgb(10, 10, 10)'}}*/}
        //         {/*                         title={!user ? "please sign-up or login to create a new discussion" : "Create a new discussion"}*/}
        //         {/*                >*/}
        //         {/*                    <Header as={'h3'}*/}
        //         {/*                            className={'myDiscussions'}>My {siteGlossary.userDiscourse[userLang]}*/}
        //         {/*                        <Button*/}
        //         {/*                            className={'newDiscussion'}*/}
        //         {/*                            floated={"right"}*/}
        //         {/*                            onClick={handleToggleDiscussion}*/}
        //         {/*                            content="New Discussion"*/}
        //         {/*                            disabled={!user}*/}
        //         {/*                            negative*/}
        //         {/*                            compact*/}
        //         {/*                        />*/}
        //         {/*                    </Header>*/}
        //
        //         {/*                    /!* attempting to only load this when user*/}
        //         {/*            role is known and render with correct link path*!/*/}
        //         {/*                    {isIndigenous !== null &&*/}
        //         {/*                    <ListItem style={{overflow: "auto", height: "16em", minWidth:"300px"}}*/}
        //         {/*                              description={myDiscussions &&*/}
        //         {/*                              myDiscussions.filter((discussion) => filterDiscussionStatus.indexOf(discussion.status) > -1 ).map((discussion) => (*/}
        //         {/*                                  <DiscussionSummary*/}
        //         {/*                                      key={discussion._id}*/}
        //         {/*                                      discussion={discussion}*/}
        //         {/*                                      participantRole={isIndigenous}*/}
        //         {/*                                  />*/}
        //         {/*                              ))}/>}*/}
        //         {/*                    <Card.Content extra>*/}
        //         {/*                        <Checkbox*/}
        //         {/*                            toggle*/}
        //         {/*                            id={'filterActive'}*/}
        //         {/*                            checked={filterDiscussionStatus.indexOf("active") > -1}*/}
        //         {/*                            onClick={(e, data) => setDiscussionFilterOnStatus(data.checked)}/>*/}
        //         {/*                        <label style={{color:"white", marginLeft:"10px"}} for={'filterActive'}>Show {filterDiscussionStatus.indexOf("active") > -1 ? "finished" : "active"}</label>*/}
        //         {/*                    </Card.Content>*/}
        //         {/*                </Segment>*/}
        //         {/*            </GridColumn>*/}
        //         {/*            <GridColumn width={8}>*/}
        //         {/*                <Segment style={{height: "23em"}} inverted hidden={isDiscussionListsHidden}*/}
        //         {/*                         style={{backgroundColor: 'rgb(10, 10, 10)'}}>*/}
        //         {/*                    <Header as={'h3'} className={'finishedDiscussions'}>*/}
        //         {/*                        All Finished {siteGlossary.userDiscourse[userLang]}</Header>*/}
        //         {/*                    <ListItem style={{overflow: "auto", height: "16em"}}*/}
        //         {/*                              description={allFinishedDiscussions &&*/}
        //         {/*                              allFinishedDiscussions.map((discussion) => (*/}
        //         {/*                                  <DiscussionSummary*/}
        //         {/*                                      key={discussion._id}*/}
        //         {/*                                      discussion={discussion}*/}
        //         {/*                                      participantRole={true}*/}
        //         {/*                                  />*/}
        //         {/*                              ))}/>*/}
        //         {/*                    <Card.Content extra>*/}
        //         {/*                    </Card.Content>*/}
        //         {/*                </Segment>*/}
        //         {/*            </GridColumn>*/}
        //         {/*        </GridRow>*/}
        //         {/*        <GridRow columns={3}>*/}
        //         {/*            <GridColumn width={5}>*/}
        //         {/*                <Segment style={{height: "21em", backgroundColor: 'rgb(10, 10, 10)'}} inverted>*/}
        //         {/*                    <Header as={'h3'} className={'myGroups'}>My Groups</Header>*/}
        //         {/*                    <ListItem style={{overflow: "auto", height: "13em"}}*/}
        //         {/*                              description={groups &&*/}
        //         {/*                              groups.map((group) => (*/}
        //         {/*                                  <GroupSummary*/}
        //         {/*                                      key={group._id}*/}
        //         {/*                                      group={group}*/}
        //         {/*                                  />*/}
        //         {/*                              ))}/>*/}
        //         {/*                    <Card.Content extra style={{margin: "1em"}}>*/}
        //         {/*                        {isAdmin &&*/}
        //         {/*                        <Button*/}
        //         {/*                            fluid*/}
        //         {/*                            onClick={handleToggleGroup}*/}
        //         {/*                            content="Create New Group"*/}
        //         {/*                            basic*/}
        //         {/*                            negative*/}
        //         {/*                        />}*/}
        //         {/*                    </Card.Content>*/}
        //         {/*                </Segment>*/}
        //         {/*            </GridColumn>*/}
        //         {/*            {isAdmin &&*/}
        //         {/*            <>*/}
        //         {/*                <GridColumn width={6}>*/}
        //         {/*                    <Segment style={{height: "21em"}} inverted*/}
        //         {/*                             style={{backgroundColor: 'rgb(10, 10, 10)'}}>*/}
        //         {/*                        <Header as={'h3'} className={'discussionTemplates'}>My Discussion*/}
        //         {/*                            Templates</Header>*/}
        //         {/*                        <ListItem style={{overflow: "auto", height: "13em"}}*/}
        //         {/*                                  description={discussionTemplates &&*/}
        //         {/*                                  discussionTemplates.map((discussionTemplate) => (*/}
        //         {/*                                      <DiscussionTemplateSummary*/}
        //         {/*                                          key={discussionTemplate._id}*/}
        //         {/*                                          template={discussionTemplate}*/}
        //         {/*                                          toggleModal={handleToggleTemplateDisplay}*/}
        //         {/*                                      />*/}
        //         {/*                                  ))}*/}
        //         {/*                        />*/}
        //         {/*                        <Card.Content extra style={{margin: "1em"}}>*/}
        //         {/*                            <Button*/}
        //         {/*                                fluid*/}
        //         {/*                                onClick={handleToggleTemplate}*/}
        //         {/*                                content="Create New Template"*/}
        //         {/*                                basic*/}
        //         {/*                                negative*/}
        //         {/*                            />*/}
        //         {/*                        </Card.Content>*/}
        //         {/*                    </Segment>*/}
        //         {/*                </GridColumn>*/}
        //         {/*                <GridColumn width={5}>*/}
        //         {/*                    <Segment style={{height: "21em"}} inverted*/}
        //         {/*                             style={{backgroundColor: 'rgb(10, 10, 10)'}}>*/}
        //         {/*                        <Header as={'h3'} className={'myScenarios'}>My scenarios</Header>*/}
        //         {/*                        <ListItem style={{overflow: "auto", height: "13em"}}*/}
        //         {/*                                  description={scenarios &&*/}
        //         {/*                                  scenarios.map((scenario) => (*/}
        //         {/*                                      <ScenarioSummary*/}
        //         {/*                                          key={scenario._id}*/}
        //         {/*                                          scenario={scenario}*/}
        //         {/*                                      />*/}
        //         {/*                                  ))}/>*/}
        //         {/*                        <Card.Content extra style={{margin: "1em"}}>*/}
        //         {/*                            <Button*/}
        //         {/*                                fluid*/}
        //         {/*                                onClick={handleToggleScenario}*/}
        //         {/*                                content="Create New Scenario"*/}
        //         {/*                                basic*/}
        //         {/*                                negative*/}
        //         {/*                            />*/}
        //         {/*                        </Card.Content>*/}
        //         {/*                    </Segment>*/}
        //         {/*                </GridColumn>*/}
        //         {/*            </>*/}
        //         {/*            }*/}
        //         {/*        </GridRow>*/}
        //         {/*        {isAdmin &&*/}
        //         {/*        <GridRow columns={3}>*/}
        //
        //         {/*            <GridColumn width={5}>*/}
        //         {/*                <Segment style={{height: "21em"}} inverted*/}
        //         {/*                         style={{backgroundColor: 'rgb(10, 10, 10)'}}>*/}
        //         {/*                    <Header as={'h3'} className={'myScenarioSets'}>My Scenario Sets</Header>*/}
        //         {/*                    <ListItem style={{overflow: "auto", height: "13em"}}*/}
        //         {/*                              description={scenarioSets &&*/}
        //         {/*                              scenarioSets.map((scenarioSet) => (*/}
        //         {/*                                  <ScenarioSetSummary*/}
        //         {/*                                      key={scenarioSet._id}*/}
        //         {/*                                      scenarioSet={scenarioSet}*/}
        //         {/*                                  />*/}
        //         {/*                              ))}/>*/}
        //         {/*                    <Card.Content extra style={{margin: "1em"}}>*/}
        //         {/*                        <Button*/}
        //         {/*                            fluid*/}
        //         {/*                            onClick={handleToggleScenarioSet}*/}
        //         {/*                            content="Create New Set"*/}
        //         {/*                            basic*/}
        //         {/*                            negative*/}
        //         {/*                        />*/}
        //         {/*                    </Card.Content>*/}
        //         {/*                </Segment>*/}
        //         {/*            </GridColumn>*/}
        //         {/*            <GridColumn width={6}>*/}
        //         {/*                <Segment style={{height: "21em"}} inverted*/}
        //         {/*                         style={{backgroundColor: 'rgb(10, 10, 10)'}}>*/}
        //         {/*                    <Header as={'h3'} className={'myExperiments'}>My Experiments</Header>*/}
        //         {/*                    <ListItem style={{overflow: "auto", height: "13em"}}*/}
        //         {/*                              description={experiments &&*/}
        //         {/*                              experiments.map((experiment) => (*/}
        //         {/*                                  <ExperimentSummary*/}
        //         {/*                                      key={experiment._id}*/}
        //         {/*                                      experiment={experiment}*/}
        //         {/*                                  />*/}
        //         {/*                              ))}/>*/}
        //         {/*                    <Card.Content extra style={{margin: "1em"}}>*/}
        //         {/*                        <Button*/}
        //         {/*                            fluid*/}
        //         {/*                            onClick={handleToggleExperimentCreation}*/}
        //         {/*                            content="Create New Experiment"*/}
        //         {/*                            basic*/}
        //         {/*                            negative*/}
        //         {/*                        />*/}
        //         {/*                    </Card.Content>*/}
        //         {/*                </Segment>*/}
        //         {/*            </GridColumn>*/}
        //         {/*            <GridColumn width={5}>*/}
        //         {/*                <Segment style={{height: "21em"}} inverted*/}
        //         {/*                         style={{backgroundColor: 'rgb(10, 10, 10)'}}>*/}
        //         {/*                    <Header as={'h3'}>Add Users to roles</Header>*/}
        //         {/*                    <Button*/}
        //         {/*                        fluid*/}
        //         {/*                        content="Assign Roles"*/}
        //         {/*                        as={Link}*/}
        //         {/*                        to="/assignroles"*/}
        //         {/*                        basic*/}
        //         {/*                        negative*/}
        //         {/*                    />*/}
        //         {/*                    <br/>*/}
        //         {/*                    <Button*/}
        //         {/*                        fluid*/}
        //         {/*                        content="Add user"*/}
        //         {/*                        as={Link}*/}
        //         {/*                        to="/AddUser"*/}
        //         {/*                        basic*/}
        //         {/*                        negative*/}
        //         {/*                    />*/}
        //         {/*                </Segment>*/}
        //         {/*            </GridColumn>*/}
        //         {/*        </GridRow>*/}
        //         {/*        }*/}
        //         {/*        <GridRow>*/}
        //         {/*            <GridColumn width={8}>*/}
        //         {/*                <Segment style={{height: "21em"}} inverted*/}
        //         {/*                         style={{backgroundColor: 'rgb(10, 10, 10)'}}>*/}
        //         {/*                    <RatingComponent/>*/}
        //         {/*                </Segment>*/}
        //         {/*            </GridColumn>*/}
        //         {/*        </GridRow>*/}
        //         {/*    </Grid>*/}
        //         {/*    /!*    Modals    *!/*/}
        //         {/*    {isOpenGroupCreation &&*/}
        //         {/*    <CreateGroup toggleModal={handleToggleGroup}*/}
        //         {/*                 isWizard={isOpenWizard}*/}
        //         {/*                 toggleNextModal={handleToggleScenario}*/}
        //         {/*                 toggleIsWizard={handleToggleWizard}/>}*/}
        //
        //         {/*    {isOpenScenarioCreation &&*/}
        //         {/*    <CreateScenario*/}
        //         {/*        toggleModal={handleToggleScenario}*/}
        //         {/*        isWizard={isOpenWizard}*/}
        //         {/*        toggleNextModal={handleToggleScenarioSet}*/}
        //         {/*        toggleIsWizard={handleToggleWizard}/>*/}
        //         {/*    }*/}
        //         {/*    {isOpenScenarioSetCreation &&*/}
        //         {/*    <CreateScenarioSet*/}
        //         {/*        toggleModal={handleToggleScenarioSet}*/}
        //         {/*        isWizard={isOpenWizard}*/}
        //         {/*        toggleNextModal={handleToggleExperimentCreation}*/}
        //         {/*        toggleIsWizard={handleToggleWizard}/>*/}
        //         {/*    }*/}
        //         {/*    {isOpenTemplateCreation &&*/}
        //         {/*    <CreateDiscussionTemplate*/}
        //         {/*        toggleModal={handleToggleTemplate}*/}
        //         {/*        isWizard={isOpenWizard}*/}
        //         {/*        toggleNextModal={handleToggleExperimentCreation}*/}
        //         {/*        toggleIsWizard={handleToggleWizard}/>*/}
        //         {/*    }*/}
        //         {/*    {isOpenExperimentCreation &&*/}
        //         {/*    <CreateExperiment*/}
        //         {/*        toggleModal={handleToggleExperimentCreation}*/}
        //         {/*        isWizard={isOpenWizard}*/}
        //         {/*        // toggleNextModal={handleToggleScenarioSet}*/}
        //         {/*        toggleIsWizard={handleToggleWizard}/>*/}
        //         {/*    }*/}
        //         {/*    {isOpenDiscussionCreation &&*/}
        //         {/*    <CreateDiscussion*/}
        //         {/*        toggleModal={handleToggleDiscussion}*/}
        //         {/*    />*/}
        //         {/*    }*/}
        //         {/*</Container>*/}
        //         {/*</Sidebar.Pusher>*/}
        //     </Sidebar.Pushable>
        // </Segment>
    );
};
