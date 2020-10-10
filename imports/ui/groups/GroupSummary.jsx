import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { List, Segment } from "semantic-ui-react";

export const GroupSummary = ({ group }) => {
  const { users } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      users: Meteor.users.find({ _id: { $in: group.members } }).fetch(),
    };
  });
  let userList = [];
  for (let i = 0; i < users.length; i++) {
    userList.push(users[i].username);
  }

  return (
    <List.Item>
      <List.Content as={Segment}
                    style={{
        backgroundColor: "#c4c4c4",
      }}>
        <List.Header as={'h4'} content={group && group.name} />
        <List.Description
          content={users && "Members: " + userList.join(", ")}
        />
      </List.Content>
    </List.Item>
  );
};
