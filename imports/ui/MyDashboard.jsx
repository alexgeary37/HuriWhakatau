import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import {
  Button,
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

  const { user, discussions, groups } = useTracker(() => {
    Meteor.subscribe("allDiscussions");
    Meteor.subscribe("groups", {members: 'vqFdTchkSz52CZWgh'});  //, 'vqFdTchkSz52CZWgh' random user id for testing

    return {
      user: Meteor.userId(),
      discussions: Discussions.find({}).fetch(),
      groups: Groups.find({}).fetch(),
    };
  });

  console.log(groups.length);

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
          <GridColumn width={8}>
          <Segment attached="bottom">
          <Header content="Groups" />
          <Segment attached="top" clearing>
            <List relaxed size="huge">
              {groups &&
              groups.map((group) => (
                  <GroupSummary
                      key={group._id}
                      group={group}
                  />
              ))}
            </List>
          </Segment>
        </Segment>
          </GridColumn>
          <GridColumn width={8}>
            <Segment attached="bottom">
              <Header content="Discussions" />
              <Segment attached="top" clearing>
                <List relaxed size="huge">
                  {discussions &&
                  discussions.map((discussion) => (
                      <DiscussionSummary
                          key={discussion._id}
                          discussion={discussion}
                      />
                  ))}
                </List>
              </Segment>
            </Segment>
          </GridColumn>
        </GridRow>
        </Grid>
      </Container>
    </div>
  );
};
