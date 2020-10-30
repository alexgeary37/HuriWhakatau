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
  Divider, Sidebar,
} from "semantic-ui-react";
import { Discussions } from "/imports/api/discussions";
import { Sidebars } from "./Sidebars";
import { NavBar } from "/imports/ui/navigation/NavBar";
import { DiscussionSummary } from "/imports/ui/discussions/DiscussionSummary";

export const Dashboard = () => {

  const { discussions } = useTracker(() => {
    Meteor.subscribe("allDiscussions");

    return {
      user: Meteor.userId(),
      discussions: Discussions.find(
        { status: { $ne: "active" } },
        { sort: { createdAt: -1 } }
      ).fetch(),
    };
  });

  return (
    <div>
      <NavBar />
      {/*<span style={{height:"20em"}} />*/}
      <Sidebar.Pushable as={Segment} style={{height: '100vh', backgroundColor: 'rgb(30, 30, 30)'}}>
        <Sidebars />
      <Container inverted={'true'} style={{overflow: "auto", height: "90vh", backgroundColor: 'rgb(10, 10, 10)'}}>
        <span style={{height:"30em"}} />
        <Segment attached="top" clearing  inverted style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
          <Header size="huge">
            <Header.Content as={Container} fluid >

              Welcome to Huri Whakatau
            </Header.Content>
          </Header>

        </Segment>

        <Segment attached="bottom" inverted style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
          <Header content="Kōrerorero" />
          <Segment attached="top" clearing style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
            <List relaxed size="huge" style={{overflow: "auto", height: "40vh"}}>
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
      </Container>
      </Sidebar.Pushable>
    </div>
  );
};
