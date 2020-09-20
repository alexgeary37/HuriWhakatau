import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {
    Button,
    Card,
    Container,
    Segment,
    Header,
    Message,
    List,
    Icon,
    Divider,
    Grid,
    GridColumn, GridRow
} from "semantic-ui-react";
import {Discussions} from "/imports/api/discussions";
import {NavBar} from "./NavBar";
import {DiscussionSummary} from "/imports/ui/discussions/DiscussionSummary";
import {GroupSummary} from "/imports/ui/groups/GroupSummary";
import {ScenarioSummary} from "/imports/ui/scenarios/ScenarioSummary";
import {ExperimentSummary} from "/imports/ui/experiments/ExperimentSummary";
import {DiscussionTemplateSummary} from "/imports/ui/discussionTemplates/DiscussionTemplateSummary";
import {ScenarioSetSummary} from "/imports/ui/scenarioSets/ScenarioSetSummary";
import {LoginForm} from "/imports/ui/users/LoginForm";
import {CreateDiscussionTemplate} from "/imports/ui/discussionTemplates/CreateDiscussionTemplate";
import {Groups} from "/imports/api/groups";
import '/imports/api/security'
import {Roles} from 'meteor/alanning:roles';
import {Scenarios} from "/imports/api/scenarios";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {Experiments} from "/imports/api/experiments";
import {Link} from "react-router-dom";

export const MyDashboard = () => {
    const [showInfo, setShowInfo] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isResearcher, setIsResearcher] = useState(false);
    const [isIndigenous, setIsIndigenous] = useState(false);
    const [isOpenTemplateCreation, setIsOpenTemplateCreation] = useState(false);

    const handletoggleCreation = () => {
        setIsOpenTemplateCreation(!isOpenTemplateCreation);
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
    //get user researcher role status and update isresearcher variable with call back. p
    // ossibly this should be a Promise?
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

    const {user, myDiscussions, allFinishedDiscussions, groups, scenarios, scenarioSets, discussionTemplates, experiments} = useTracker(() => {
        //subscribe to roles for user permissions check, should this be ^^ up there?
        let fetchedDiscussionTemplates = null;
        Meteor.subscribe("roles");
        Meteor.subscribe("allDiscussions");
        Meteor.subscribe("groups");
        Meteor.subscribe("scenarios");
        Meteor.subscribe("scenarioSets");
        Meteor.subscribe("discussionTemplates");
        Meteor.subscribe("experiments");


        let userId = Meteor.userId();

        let fetchedGroups = Groups.find({members: {$elemMatch: {$eq: userId}}}).fetch(); //,
        let fetchedScenarios = Scenarios.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedScenarioSets = ScenarioSets.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        fetchedDiscussionTemplates = DiscussionTemplates.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        let fetchedExperiments = Experiments.find({createdBy: {$in: [userId, "ADMIN"]}}).fetch(); //,
        // console.log(fetchedDiscussionTemplates[0].name);

        // need to handle case where user has no groups or discussions yet.
        let groupIds = [];
        for (let i = 0; i < fetchedGroups.length; i++) {
            groupIds.push(fetchedGroups[i]._id);
        }
        let fetchedAllFinishedDiscussions = Discussions.find({status: {$ne: "active"}}, {sort: {createdAt: -1}}).fetch();
        let fetchedMyDiscussions = Discussions.find({groupId: {$in: groupIds}}, {
            sort: {
                createdAt: -1,
                status: 1
            }
        }).fetch();

        return {
            user: userId,
            myDiscussions: fetchedMyDiscussions,
            allFinishedDiscussions: fetchedAllFinishedDiscussions,
            groups: fetchedGroups,
            scenarios: fetchedScenarios,
            scenarioSets: fetchedScenarioSets,
            discussionTemplates: fetchedDiscussionTemplates,
            experiments: fetchedExperiments,
        };
    });

    // if (!user) {
    //     return (
    //         <div className="dashboard-login">
    //             <LoginForm/>
    //         </div>
    //     );
    // }

    return (
        <div>
            <NavBar/>
            <Container>
                <Segment attached="top" clearing>
                    <Header size="huge">
                        <Header.Content as={Container} fluid>
                            <Button
                                floated="right"
                                circular
                                color="blue"
                                size="large"
                                icon="help"
                                onClick={() => setShowInfo(!showInfo)}
                            />
                            My Dashboard {isAdmin && <span>- Admin</span>}
                        </Header.Content>
                    </Header>
                </Segment>

                <Grid columns={4}>
                    <GridRow>
                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='My Groups'/>
                                <Card.Content style={{overflow: "auto", height: "25vh"}}
                                              description={groups &&
                                              groups.map((group) => (
                                                  <GroupSummary
                                                      key={group._id}
                                                      group={group}
                                                  />
                                              ))}/>
                                <Card.Content extra>
                                    {isAdmin &&
                                    <Button
                                        content="Create New Group"
                                        as={Link}
                                        to="/groups/create"
                                        color="green"
                                    />}
                                </Card.Content>
                            </Card>
                        </GridColumn>
                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='My Discussions'/>
                                <Card.Content style={{overflow: "auto", height: "25vh"}}
                                              description={myDiscussions &&
                                              myDiscussions.map((discussion) => (
                                                  <DiscussionSummary
                                                      key={discussion._id}
                                                      discussion={discussion}
                                                      participantRole={isIndigenous}
                                                  />
                                              ))}/>
                                <Card.Content extra>
                                </Card.Content>
                            </Card>
                        </GridColumn>
                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='All Finished Discussions'/>
                                <Card.Content style={{overflow: "auto", height: "25vh"}}
                                              description={allFinishedDiscussions &&
                                              allFinishedDiscussions.map((discussion) => (
                                                  <DiscussionSummary
                                                      key={discussion._id}
                                                      discussion={discussion}
                                                  />
                                              ))}/>
                                <Card.Content extra>
                                </Card.Content>
                            </Card>
                        </GridColumn>
                        {isAdmin &&
                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='My Discussion Templates'/>
                                <Card.Content style={{overflow: "auto", height: "25vh"}}
                                              description={discussionTemplates &&
                                              discussionTemplates.map((discussionTemplate) => (
                                                  <DiscussionTemplateSummary
                                                      key={discussionTemplate._id}
                                                      template={discussionTemplate}
                                                  />
                                              ))}
                                />
                                <Card.Content extra>
                                    <Button
                                        onClick={handletoggleCreation}
                                        content="Create New Template"
                                        // as={Link}
                                        // to="/discussionTemplates/create"
                                        color="green"
                                    />
                                </Card.Content>
                            </Card>
                        </GridColumn>
                        }
                    </GridRow>
                    {isAdmin &&
                    <GridRow>
                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='My scenarios'/>
                                <Card.Content style={{overflow: "auto", height: "25vh"}}
                                              description={scenarios &&
                                              scenarios.map((scenario) => (
                                                  <ScenarioSummary
                                                      key={scenario._id}
                                                      scenario={scenario}
                                                  />
                                              ))}/>
                                <Card.Content extra>
                                    <Button
                                        content="Create New"
                                        as={Link}
                                        to="/scenarios/create"
                                        color="green"
                                    />
                                </Card.Content>
                            </Card>
                        </GridColumn>

                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='My Scenario Sets'/>
                                <Card.Content style={{overflow: "auto", height: "25vh"}}
                                              description={scenarioSets &&
                                              scenarioSets.map((scenarioSet) => (
                                                  <ScenarioSetSummary
                                                      key={scenarioSet._id}
                                                      scenarioSet={scenarioSet}
                                                  />
                                              ))}/>
                                <Card.Content extra>
                                    <Button
                                        content="Create New Set"
                                        as={Link}
                                        to="/scenarioSets/create"
                                        color="green"
                                    />
                                </Card.Content>
                            </Card>
                        </GridColumn>
                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='My Experiments'/>
                                <Card.Content style={{overflow: "auto", height: "25vh"}}
                                              description={experiments &&
                                              experiments.map((experiment) => (
                                                  <ExperimentSummary
                                                      key={experiment._id}
                                                      experiment={experiment}
                                                  />
                                              ))}/>
                                <Card.Content extra>
                                    <Button
                                        content="Create New Experiment"
                                        as={Link}
                                        to="/experiments/create"
                                        color="green"
                                    />
                                </Card.Content>
                            </Card>
                        </GridColumn>
                        <GridColumn width={4}>
                            <Card style={{height: "35vh"}}>
                                <Card.Content header='Add Users to roles'/>
                                {/*<Card.Content>*/}

                                {/*</Card.Content>*/}
                                <Card.Content extra>
                                    <Button
                                        content="Assign Roles"
                                        as={Link}
                                        to="/assignroles"
                                        color="green"
                                    />
                                    <Button
                                        content="Add user"
                                        as={Link}
                                        to="/AddUser"
                                        color="green"
                                    />
                                </Card.Content>
                            </Card>
                        </GridColumn>
                    </GridRow>
                    }
                </Grid>
            {/*    Modals    */}
                {isOpenTemplateCreation &&
                <CreateDiscussionTemplate
                    toggleModal={handletoggleCreation}/>
                }


            </Container>
        </div>
    );
};
