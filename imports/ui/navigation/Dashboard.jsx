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
import { NavBar } from "/imports/ui/navigation/NavBar";
import { Sidebars } from "./Sidebars";
import { DiscussionSummary } from "/imports/ui/discussions/DiscussionSummary";

export const Dashboard = () => {

  const { discussions, publicDiscussions } = useTracker(() => {
    Meteor.subscribe("allDiscussions");

    return {
      user: Meteor.userId(),
      discussions: Discussions.find(
        { status: { $ne: "active" } },
        { sort: { createdAt: -1 } }
      ).fetch(),
      publicDiscussions: Discussions.find(
          { $and: [{status: "active"}, {isPublic: {$eq:true}}] },
          { sort: { createdAt: -1 } }
      ).fetch(),
    };
  });

  return (
    <div>
      <NavBar />
      {/*<span style={{height:"20em"}} />*/}
      <Sidebar.Pushable as={Segment} style={{height: 'auto', backgroundColor: 'rgb(25,50,26)'}}>
        <Sidebars />
      <Container inverted={'true'} style={{overflow: "auto", height: "100vh"}}>
        <span style={{height:"30em"}} />
        <Segment attached="top" clearing  inverted style={{border: 'none'}}>
          <Header size="huge">
            <Header.Content as={Container} fluid >

              Welcome to Huri Whakatau
            </Header.Content>
          </Header>

        </Segment>

        <Segment attached="bottom" inverted style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
          <Header content="Kōrerorero" />
          <Segment inverted attached="top" style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
            <Header as={'h3'} content={"Public kōrerorero"} />
            <List relaxed size="huge" style={{overflow: "auto", height: "40vh"}}>
              {publicDiscussions &&
              publicDiscussions.map((discussion) => (
                  <DiscussionSummary
                    key={discussion._id}
                    discussion={discussion}
                  />
                ))}
            </List>
          </Segment>
          <Segment inverted attached="top" style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
            <Header as={'h3'} content={"Finished kōrerorero"} />
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
