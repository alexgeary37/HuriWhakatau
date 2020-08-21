import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button, Container, Segment, List, Header } from "semantic-ui-react";
import { Groups } from "/imports/api/groups";

export const BrowseGroups = () => {
  const { groups } = useTracker(() => {
    Meteor.subscribe("groups");

    return {
      groups: Groups.find().fetch(),
    };
  });

  return (
    <Container>
      <Segment attached="top">
        <Button
          content="Create New"
          as={Link}
          to="/groups/create"
          color="green"
        />
      </Segment>
      <Segment attached="bottom">
        <Header content="Discussions" />

        <List relaxed size="huge">
          {groups &&
            groups.map((group) => (
              <List.Item key={group._id} as={Link} to={`/groups/${group._id}`}>
                <List.Content as={Segment}>
                  <List.Header content={group.name} />
                </List.Content>
              </List.Item>
            ))}
        </List>
      </Segment>
    </Container>
  );
};
