import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const GroupSummary = ({ group }) => {
  // const { scenario } = useTracker(() => {
  //   Meteor.subscribe("scenarios");
  //
  //   return {
  //     scenario: Scenarios.findOne({ _id: discussion.scenarioId }),
  //   };
  // });
    const { users } = useTracker(() => {
        Meteor.subscribe("users");

        return {
            users: Meteor.users.find({ _id: {$in :group.members}}).fetch(),
        };
    });
// console.log(users[0]);
let userList = [];
for (let i=0;i<users.length; i++){
    userList.push(users[i].username);
}

  return (
    <List.Item as={Link} to={`/groups/${group._id}`}>
      <List.Content as={Segment}>
        <List.Header content={group && group.name} />
        <List.Description content={users && 'Members: ' + userList.join(", ")} />
      </List.Content>
    </List.Item>
  );
};
