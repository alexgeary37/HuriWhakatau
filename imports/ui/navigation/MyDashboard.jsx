import { useTracker } from "meteor/react-meteor-data";
import React, { useEffect, useState, Suspense, lazy } from "react";
import {
  Button,
  Card,
  Container,
  Segment,
  Header,
  Grid,
  GridColumn,
  GridRow,
  ListItem,
  Divider,
  Checkbox,
} from "semantic-ui-react";
import "/imports/api/security";
import { Link } from "react-router-dom";
import { Groups } from "/imports/api/groups";
import { Scenarios } from "/imports/api/scenarios";
import { Experiments } from "/imports/api/experiments";
import { Discussions } from "/imports/api/discussions";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { siteGlossary } from "../../api/glossary";
import { myDashParticipant, myDashResearcher } from "/imports/api/tourSteps";
import { DiscussionTemplates } from "/imports/api/discussionTemplate";
import { Tour } from "./Tour";
import { CreateGroup } from "../groups/CreateGroup";
import { GroupSummary } from "/imports/ui/groups/GroupSummary";
import { CreateScenario } from "../scenarios/CreateScenario";
import { RatingComponent } from "./RatingComponent";
import { AddUser } from "../users/AddUser";
import { AssignRoles } from "../users/AssignRoles";
// const ScenarioSummary = lazy(() => import("/imports/ui/scenarios/ScenarioSummary"));
import { ScenarioSummary } from "/imports/ui/scenarios/ScenarioSummary";
import { CreateDiscussion } from "/imports/ui/discussions/CreateDiscussion";
import { CreateExperiment } from "../experiments/CreateExperiment";
import { DiscussionSummary } from "/imports/ui/discussions/DiscussionSummary";
import { ExperimentSummary } from "/imports/ui/experiments/ExperimentSummary";
import { CreateScenarioSet } from "../scenarioSets/CreateScenarioSet";
import { ScenarioSetSummary } from "/imports/ui/scenarioSets/ScenarioSetSummary";
import { CreateDiscussionTemplate } from "/imports/ui/discussionTemplates/CreateDiscussionTemplate";
import { DiscussionTemplateSummary } from "/imports/ui/discussionTemplates/DiscussionTemplateSummary";
import Cookies from "universal-cookie/lib";
import { Layout } from "./Layout";

export const MyDashboard = () => {
  const cookies = new Cookies();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isResearcher, setIsResearcher] = useState(false);
  const [isIndigenous, setIsIndigenous] = useState(null);
  const [isOpenWizard, setIsOpenWizard] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isOpenTemplateCreation, setIsOpenTemplateCreation] = useState(false);
  const [isOpenScenarioCreation, setIsOpenScenarioCreation] = useState(false);
  const [isOpenScenarioSetCreation, setIsOpenScenarioSetCreation] = useState(
    false
  );
  const [isOpenExperimentCreation, setIsOpenExperimentCreation] = useState(
    false
  );
  const [isOpenGroupCreation, setIsOpenGroupCreation] = useState(false);
  const [isOpenTemplateDisplay, setIsOpenTemplateDisplay] = useState(false);
  const [isOpenDiscussionCreation, setIsOpenDiscussionCreation] = useState(
    false
  );
  const [isOpenNewUser, setIsOpenNewUser] = useState(false);
  const [isOpenAssignRoles, setIsOpenAssignRoles] = useState(false);
  // const [template, setTemplate] = useState(null);
  const [isDiscussionListsHidden, setIsDiscussionListsHidden] = useState(false);
  const [filterDiscussionStatus, setFilterDiscussionStatus] = useState([
    "active",
  ]);
  const participantTourSteps = myDashParticipant;
  const researcherTourSteps = myDashResearcher;

  useEffect(() => {
    document.title = "My Dashboard";
  }, []);

  const toggleShowTour = () => {
    if (!cookies.get("myDashTour")) {
      setShowTour(!showTour);
    }
  };

  useEffect(() => {
    toggleShowTour();
  }, []);

  const handleToggleWizard = () => {
    setIsOpenWizard(!isOpenWizard);
  };
  //is there a more abstracted way to handle all these modal open/closes?
  const handleToggleTemplate = () => {
    setIsOpenTemplateCreation(!isOpenTemplateCreation);
  };
  const handleToggleScenario = () => {
    setIsOpenScenarioCreation(!isOpenScenarioCreation);
  };
  const handleToggleScenarioSet = () => {
    setIsOpenScenarioSetCreation(!isOpenScenarioSetCreation);
  };
  const handleToggleExperimentCreation = () => {
    setIsOpenExperimentCreation(!isOpenExperimentCreation);
  };
  const handleToggleTemplateDisplay = () => {
    // setTemplate(template); // template is undefined. make async
    setIsOpenTemplateDisplay(!isOpenTemplateDisplay);
  };
  const handleToggleGroup = () => {
    setIsOpenGroupCreation(!isOpenGroupCreation);
  };
  const handleToggleDiscussion = () => {
    setIsOpenDiscussionCreation(!isOpenDiscussionCreation);
  };
  const handleToggleNewUser = () => {
    setIsOpenNewUser(!isOpenNewUser);
  };
  const handleToggleAssignRoles = () => {
    setIsOpenAssignRoles(!isOpenAssignRoles);
  };
  //get user admin role status and update isAdmin variable with call back.
  Meteor.call("security.hasRole", Meteor.userId(), "ADMIN", (error, result) => {
    if (error) {
      console.log(error.reason);
      return;
    }
    setIsAdmin(result);
  });
  //get user researcher role status and update isResearcher variable with call back.
  Meteor.call(
    "security.hasRole",
    Meteor.userId(),
    "RESEARCHER",
    (error, result) => {
      if (error) {
        console.log(error.reason);
        return;
      }
      setIsResearcher(result);
    }
  );
  //get user indigenous role status and update isIndigenous variable with call back.
  Meteor.call(
    "security.hasRole",
    Meteor.userId(),
    "PARTICIPANT_I",
    (error, result) => {
      if (error) {
        console.log(error.reason);
        return;
      }
      setIsIndigenous(result);
    }
  );

  const {
    user,
    myDiscussions,
    allFinishedDiscussions,
    groups,
    scenarios,
    scenarioSets,
    discussionTemplates,
    experiments,
  } = useTracker(() => {
    //subscribe to roles for user permissions check, should this be ^^ up there?
    Meteor.subscribe("roles");
    Meteor.subscribe("allDiscussions");
    Meteor.subscribe("groups");
    Meteor.subscribe("scenarios");
    Meteor.subscribe("scenarioSets");
    Meteor.subscribe("discussionTemplates");
    Meteor.subscribe("experiments");
    let userSub = Meteor.subscribe("users");
    let groupIds = [];
    let userId = Meteor.userId();
    let fetchedGroups = Groups.find({
      members: { $elemMatch: { $eq: userId } },
    }).fetch(); //,
    let fetchedScenarios = Scenarios.find({
      createdBy: { $in: [userId, "ADMIN"] },
    }).fetch(); //,
    let fetchedScenarioSets = ScenarioSets.find({
      createdBy: { $in: [userId, "ADMIN"] },
    }).fetch(); //,
    let fetchedDiscussionTemplates = DiscussionTemplates.find({
      createdBy: { $in: [userId, "ADMIN"] },
    }).fetch(); //,
    let fetchedExperiments = Experiments.find({
      createdBy: { $in: [userId, "ADMIN"] },
    }).fetch(); //,
    let fetchedAllFinishedDiscussions = Discussions.find(
      { status: { $ne: "active" } },
      { sort: { createdAt: -1 } }
    ).fetch();
    // need to handle case where user has no groups or discussions yet.
    for (let i = 0; i < fetchedGroups.length; i++) {
      groupIds.push(fetchedGroups[i]._id);
    }
    let fetchedMyDiscussions = Discussions.find(
      { $or: [{ groupId: { $in: groupIds } }, { createdBy: userId }] },
      {
        sort: {
          createdAt: -1,
          status: 1,
        },
      }
    ).fetch();

    return {
      user: Meteor.userId(),
      myDiscussions: fetchedMyDiscussions,
      allFinishedDiscussions: fetchedAllFinishedDiscussions,
      groups: fetchedGroups,
      scenarios: fetchedScenarios,
      scenarioSets: fetchedScenarioSets,
      discussionTemplates: fetchedDiscussionTemplates,
      experiments: fetchedExperiments,
    };
  });

  const toggleDiscussionLists = () => {
    setIsDiscussionListsHidden(!isDiscussionListsHidden);
  };

  const setDiscussionFilterOnStatus = (e) => {
    if (e) {
      setFilterDiscussionStatus(["active"]);
    } else {
      setFilterDiscussionStatus(["finished", "hung", "timedout"]);
    }
  };

  const myDashboardPageContent = (userLang) => {
    return (
      <Container textAlign="left">
        {showTour && (
          <Tour
            TOUR_STEPS={
              isAdmin
                ? participantTourSteps.concat(researcherTourSteps)
                : participantTourSteps
            }
          />
        )}
        <Segment
          attached="top"
          clearing
          inverted
          style={{ backgroundColor: "rgb(10, 10, 10)", border: "none" }}
        >
          <Header size="huge">
            <Header.Content as={Container}>
              My Dashboard {isAdmin && <span>- Admin</span>}
              {isAdmin && (
                <Button
                  floated="right"
                  onClick={() => {
                    handleToggleWizard();
                    handleToggleGroup();
                  }}
                  content="Open Experiment Wizard"
                  negative
                />
              )}
            </Header.Content>
          </Header>
        </Segment>

        <Grid stackable>
          <GridRow columns={isDiscussionListsHidden ? 1 : 2}>
            <GridColumn width={16}>
              <Divider />
              <Header
                as={Link}
                to={"/mydashboard"}
                floated="right"
                inverted
                onClick={toggleDiscussionLists}
              >
                {isDiscussionListsHidden ? "Show" : "Hide"} Discussions
              </Header>
              <br />
              {isDiscussionListsHidden && <Divider />}
            </GridColumn>
            <GridColumn width={8}>
              <Segment
                style={{ height: "23em" }}
                inverted
                hidden={isDiscussionListsHidden}
                style={{ backgroundColor: "rgb(10, 10, 10)" }}
                title={
                  !user
                    ? "please sign-up or login to create a new discussion"
                    : "Create a new discussion"
                }
              >
                <Header as={"h3"} className={"myDiscussions"}>
                  My {siteGlossary.userDiscourse[userLang]}
                  {/* <Button
                    className={"newDiscussion"}
                    floated={"right"}
                    onClick={handleToggleDiscussion}
                    content="New Discussion"
                    disabled={!user}
                    negative
                    compact
                  /> */}
                </Header>

                {/* attempting to only load this when user
                                role is known and render with correct link path*/}
                {isIndigenous !== null && (
                  <ListItem
                    style={{
                      overflow: "auto",
                      height: "16em",
                      minWidth: "300px",
                    }}
                    description={
                      myDiscussions &&
                      myDiscussions
                        .filter(
                          (discussion) =>
                            filterDiscussionStatus.indexOf(discussion.status) >
                            -1
                        )
                        .map((discussion) => (
                          <DiscussionSummary
                            key={discussion._id}
                            discussion={discussion}
                            participantRole={isIndigenous}
                          />
                        ))
                    }
                  />
                )}
                <Card.Content extra>
                  <Checkbox
                    toggle
                    id={"filterActive"}
                    checked={filterDiscussionStatus.indexOf("active") > -1}
                    onClick={(e, data) =>
                      setDiscussionFilterOnStatus(data.checked)
                    }
                  />
                  <label style={{ color: "white", marginLeft: "10px" }}>
                    Show{" "}
                    {filterDiscussionStatus.indexOf("active") > -1
                      ? "finished"
                      : "active"}
                  </label>
                </Card.Content>
              </Segment>
            </GridColumn>
            <GridColumn width={8}>
              <Segment
                style={{ height: "23em" }}
                inverted
                hidden={isDiscussionListsHidden}
                style={{ backgroundColor: "rgb(10, 10, 10)" }}
              >
                <Header as={"h3"} className={"finishedDiscussions"}>
                  All Finished {siteGlossary.userDiscourse[userLang]}
                </Header>
                <ListItem
                  style={{ overflow: "auto", height: "16em" }}
                  description={
                    allFinishedDiscussions &&
                    allFinishedDiscussions.map((discussion) => (
                      <DiscussionSummary
                        key={discussion._id}
                        discussion={discussion}
                        participantRole={true}
                      />
                    ))
                  }
                />
                <Card.Content extra></Card.Content>
              </Segment>
            </GridColumn>
          </GridRow>
          <GridRow columns={3}>
            <GridColumn width={5}>
              <Segment
                style={{ height: "21em", backgroundColor: "rgb(10, 10, 10)" }}
                inverted
              >
                <Header as={"h3"} content="My Groups" className={"myGroups"} />
                <ListItem
                  style={{ overflow: "auto", height: "13em" }}
                  description={
                    groups &&
                    groups.map((group) => (
                      <GroupSummary key={group._id} group={group} />
                    ))
                  }
                />
                <Card.Content extra style={{ margin: "1em" }}>
                  {isAdmin && (
                    <Button
                      fluid
                      onClick={handleToggleGroup}
                      content="Create New Group"
                      basic
                      negative
                    />
                  )}
                </Card.Content>
              </Segment>
            </GridColumn>
            {isAdmin && (
              <>
                <GridColumn width={6}>
                  <Segment
                    style={{ height: "21em" }}
                    inverted
                    style={{ backgroundColor: "rgb(10, 10, 10)" }}
                  >
                    <Header as={"h3"} content="My Discussion Templates" className={"discussionTemplates"} />
                    <ListItem
                      style={{ overflow: "auto", height: "13em" }}
                      description={
                        discussionTemplates &&
                        discussionTemplates.map((discussionTemplate) => (
                          <DiscussionTemplateSummary
                            key={discussionTemplate._id}
                            template={discussionTemplate}
                          />
                        ))
                      }
                    />
                    <Card.Content extra style={{ margin: "1em" }}>
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
                  <Segment
                    style={{ height: "21em" }}
                    inverted
                    style={{ backgroundColor: "rgb(10, 10, 10)" }}
                  >
                    <Header as={"h3"} content="My scenarios" className={"myScenarios"} />
                    <ListItem
                      style={{ overflow: "auto", height: "13em" }}
                      description={
                        scenarios &&
                        scenarios.map((scenario) => (
                          <ScenarioSummary
                            key={scenario._id}
                            scenario={scenario}
                          />
                        ))
                      }
                    />
                    <Card.Content extra style={{ margin: "1em" }}>
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
            )}
          </GridRow>
          {isAdmin && (
            <GridRow columns={3}>
              <GridColumn width={5}>
                <Segment
                  style={{ height: "21em" }}
                  inverted
                  style={{ backgroundColor: "rgb(10, 10, 10)" }}
                >
                  <Header as={"h3"} content="My Scenario Sets" className={"myScenarioSets"} />
                  <ListItem
                    style={{ overflow: "auto", height: "13em" }}
                    description={
                      scenarioSets &&
                      scenarioSets.map((scenarioSet) => (
                        <ScenarioSetSummary
                          key={scenarioSet._id}
                          scenarioSet={scenarioSet}
                        />
                      ))
                    }
                  />
                  <Card.Content extra style={{ margin: "1em" }}>
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
                <Segment
                  style={{ height: "21em" }}
                  inverted
                  style={{ backgroundColor: "rgb(10, 10, 10)" }}
                >
                  <Header as={"h3"} content="My Experiments" className={"myExperiments"} />
                  <ListItem
                    style={{ overflow: "auto", height: "13em" }}
                    description={
                      experiments &&
                      experiments.map((experiment) => (
                        <ExperimentSummary
                          key={experiment._id}
                          experiment={experiment}
                        />
                      ))
                    }
                  />
                  <Card.Content extra style={{ margin: "1em" }}>
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
                <Segment
                  style={{ height: "21em" }}
                  inverted
                  style={{ backgroundColor: "rgb(10, 10, 10)" }}
                >
                  <Header as={"h3"} content="Add Users to Roles" />
                  <Button
                    fluid
                    content="Assign Roles"
                    onClick={handleToggleAssignRoles}
                    // as={Link}
                    // to="/assignroles"
                    basic
                    negative
                  />
                  <br />
                  <Button
                    fluid
                    content="Add User"
                    onClick={handleToggleNewUser}
                    // as={Link}
                    // to="/AddUser"
                    basic
                    negative
                  />
                </Segment>
              </GridColumn>
            </GridRow>
          )}
          <GridRow>
            <GridColumn width={8}>
              <Segment
                style={{ height: "21em" }}
                inverted
                style={{ backgroundColor: "rgb(10, 10, 10)" }}
              >
                <RatingComponent />
              </Segment>
            </GridColumn>
          </GridRow>
        </Grid>
        {/*    Modals    */}
        {isOpenGroupCreation && (
          <CreateGroup
            toggleModal={handleToggleGroup}
            isWizard={isOpenWizard}
            toggleNextModal={handleToggleScenario}
            toggleIsWizard={handleToggleWizard}
          />
        )}

        {isOpenScenarioCreation && (
          <CreateScenario
            toggleModal={handleToggleScenario}
            isWizard={isOpenWizard}
            toggleNextModal={handleToggleScenarioSet}
            toggleIsWizard={handleToggleWizard}
          />
        )}
        {isOpenScenarioSetCreation && (
          <CreateScenarioSet
            toggleModal={handleToggleScenarioSet}
            isWizard={isOpenWizard}
            toggleNextModal={handleToggleExperimentCreation}
            toggleIsWizard={handleToggleWizard}
          />
        )}
        {isOpenTemplateCreation && (
          <CreateDiscussionTemplate
            toggleModal={handleToggleTemplate}
            isWizard={isOpenWizard}
            toggleNextModal={handleToggleExperimentCreation}
            toggleIsWizard={handleToggleWizard}
          />
        )}
        {isOpenExperimentCreation && (
          <CreateExperiment
            toggleModal={handleToggleExperimentCreation}
            isWizard={isOpenWizard}
            // toggleNextModal={handleToggleScenarioSet}
            toggleIsWizard={handleToggleWizard}
          />
        )}
        {isOpenDiscussionCreation && (
          <CreateDiscussion toggleModal={handleToggleDiscussion} />
        )}
        {isOpenNewUser && <AddUser toggleModal={handleToggleNewUser} />}
        {isOpenAssignRoles && (
          <AssignRoles toggleModal={handleToggleAssignRoles} />
        )}
      </Container>
    );
  };

  return <Layout page={myDashboardPageContent} />;
};
