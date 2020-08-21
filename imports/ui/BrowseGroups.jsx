import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button, Container, Segment, List } from "semantic-ui-react";
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
      <List as={Segment} attached="bottom" divided relaxed="very">
        {groups &&
          groups.map((group) => (
            <List.Item key={group._id} as={Link} to={`/groups/${group._id}`}>
              <List.Content header={group.name} />
            </List.Item>
          ))}
      </List>
    </Container>
    // <div className="browseGroups">
    //   <h1>Groups</h1>
    //   <ul className="groups">
    //     {groups.map((group) => (
    //       <div className="groupContainer" key={group._id}>
    //         <Button content={group.name} as={Link} to={`/${group._id}`} />
    //       </div>
    //     ))}
    //   </ul>
    //   <Button content="Create Group" as={Link} to={"/groups/create"} />
    // </div>
  );
};
