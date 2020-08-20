import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Container, Segment, Form, Modal } from "semantic-ui-react";

export const CreateGroup = () => {
  const [members, addToMembers] = useState([]);

  const { users } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      users: Meteor.users.find().fetch(),
    };
  });

  return (
    <Form as={Segment} attached="bottom">
      <Form.Field control={Form.Group} label="Users">
        <Form.Dropdown
          width={14}
          loading={users.length === 0}
          selection
          multiple
          search
          options={users.map((user) => ({
            key: user._id,
            text: user._id,
            value: user._id,
          }))}
          name="members"
          value={members}
          onChange={(e) => {
            console.log("e:", e.target.value);
            addToMembers(members.concat(e.target.value));
            members.map((m) => console.log(m));
          }}
        />
      </Form.Field>
      <Form.Button
        content="Submit"
        onClick={() =>
          members.length > 1 &&
          Meteor.call(
            "groups.create",
            "Group name",
            members,
            (event, groupId) => history.push(`/groups/${groupId}`)
          )
        }
      />
    </Form>
  );
};
