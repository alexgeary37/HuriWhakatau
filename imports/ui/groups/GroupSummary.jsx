import React, {useState} from "react";
import { useTracker } from "meteor/react-meteor-data";
import {Button, List, Segment} from "semantic-ui-react";
import {ViewGroup} from "./ViewGroup";

export const GroupSummary = ({ group }) => {
  const [isOpenGroupDisplay, setIsOpenGroupDisplay] = useState(false);
  const toggleIt = () => {
    setIsOpenGroupDisplay(!isOpenGroupDisplay);
  }

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
        {/*<List.Description*/}
        {/*  content={users && "Members: " + userList.join(", ")}*/}
        {/*/>*/}
        <Button content={'open'} onClick={toggleIt} />
        {/* show exp details */}
        {isOpenGroupDisplay &&
        <ViewGroup
            toggleModal={toggleIt}
            group={group} />
        }
      </List.Content>
    </List.Item>
  );
};
