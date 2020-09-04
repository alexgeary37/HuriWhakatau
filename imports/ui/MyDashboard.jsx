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

export const MyDashboard = () => {
  const [showInfo, setShowInfo] = useState(true);

  const { user, myDiscussions, allFinishedDiscussions, groups } = useTracker(() => {
    Meteor.subscribe("allDiscussions");
    Meteor.subscribe("groups");
    let fetchedGroups = Groups.find({members: { $elemMatch: { $eq : Meteor.userId()}}}).fetch(); //, 'vqFdTchkSz52CZWgh'
    // random user id for testing replace with Meteor.userId(). Also need to handle case where user has no groups or discussions yet.
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
        {/* ########################################################################
        Display 'Dashboard' and '?' */}
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
              My Dashboard
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
        </GridRow>
        </Grid>
      </Container>
    </div>
  );
};
