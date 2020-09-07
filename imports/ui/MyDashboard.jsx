import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
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
import { Discussions } from "/imports/api/discussions";
import { NavBar } from "./NavBar";
import { DiscussionSummary } from "./DiscussionSummary";
import { GroupSummary } from "./GroupSummary";
import { LoginForm } from "./LoginForm";
import {Groups} from "../api/groups";
import '../api/security'
import { Roles } from 'meteor/alanning:roles';

export const MyDashboard = () => {
  const [showInfo, setShowInfo] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  //get user admin role status and update isAdmin variable with call back. possibly this should be a Promise?
  Meteor.call("security.hasRole", Meteor.userId(), "ADMIN", (error, result) => {
    if(error){
      console.log(error.reason);
      return;
    }
    console.log("succy: ", result);
    setIsAdmin(result);
  });

  const { user, myDiscussions, allFinishedDiscussions, groups } = useTracker(() => {
    //subscribe to roles for user permissions check, should this be ^^ up there?
    Meteor.subscribe("roles");
    Meteor.subscribe("allDiscussions");
    Meteor.subscribe("groups");
    let fetchedGroups = Groups.find({members: { $elemMatch: { $eq : Meteor.userId()}}}).fetch(); //,
    // need to handle case where user has no groups or discussions yet.

    let groupIds = [];
    for (let i=0;i<fetchedGroups.length; i++){
      groupIds.push(fetchedGroups[i]._id);
    }
    let fetchedAllFinishedDiscussions = Discussions.find({ status: {$ne :"active"} }, { sort: { status: 1 }}).fetch();
    let fetchedMyDiscussions = Discussions.find({ groupId: {$in :groupIds}}, { sort: { status: 1 }}).fetch();

    return {
      user: Meteor.userId(),
      myDiscussions: fetchedMyDiscussions,
      allFinishedDiscussions: fetchedAllFinishedDiscussions,
      groups: fetchedGroups,
    };
  });

  if (!user) {
    return (
      <div className="dashboard-login">
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Container>
        <Segment attached="top" clearing>
          <Header size="huge">
            <Header.Content as={Container} fluid>
              <Button
                floated="right"
                circular
                color="blue"
                size="massive"
                icon="help circle"
                onClick={() => setShowInfo(!showInfo)}
              />
              My Dashboard {isAdmin && <span>- Admin</span>}
            </Header.Content>
          </Header>
        </Segment>

        <Grid columns={2}><GridRow>
          <GridColumn width={4}>
            <Card>
              <Card.Content header='My Groups' />
              <Card.Content style={{ overflow: "auto", maxHeight: "40vh" }}
                            description={groups &&
              groups.map((group) => (
                  <GroupSummary
                      key={group._id}
                      group={group}
                  />
              ))} />
              <Card.Content extra>
            </Card.Content>
            </Card>
          </GridColumn>
          <GridColumn width={4}>
            <Card>
              <Card.Content header='My Discussions' />
              <Card.Content style={{ overflow: "auto", maxHeight: "40vh" }}
                            description={myDiscussions &&
                            myDiscussions.map((discussion) => (
                  <DiscussionSummary
                      key={discussion._id}
                      discussion={discussion}
                  />
              ))} />
              <Card.Content extra>
              </Card.Content>
            </Card>
          </GridColumn>
          <GridColumn width={4}>
            <Card>
              <Card.Content header='All Finished Discussions' />
              <Card.Content style={{ overflow: "auto", maxHeight: "40vh" }}
                            description={allFinishedDiscussions &&
                            allFinishedDiscussions.map((discussion) => (
                                <DiscussionSummary
                                    key={discussion._id}
                                    discussion={discussion}
                                />
                            ))} />
              <Card.Content extra>
              </Card.Content>
            </Card>
          </GridColumn>
          {isAdmin && <GridColumn width={4}>
            <Card>
              <Card.Content header='Some admin stuff eventually' />
              <Card.Content style={{ overflow: "auto", maxHeight: "40vh" }}
                            description={allFinishedDiscussions &&
                            allFinishedDiscussions.map((discussion) => (
                                <DiscussionSummary
                                    key={discussion._id}
                                    discussion={discussion}
                                />
                            ))} />
              <Card.Content extra>
              </Card.Content>
            </Card>
          </GridColumn>
          }
        </GridRow>
        </Grid>
      </Container>
    </div>
  );
};
