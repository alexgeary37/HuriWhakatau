import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Container, Segment, Form } from "semantic-ui-react";
import { Discussions } from "/imports/api/discussions";

export const CreateGroup = () => {
  const [discussionSet, setDiscussionSet] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const { users, discussions } = useTracker(() => {
    Meteor.subscribe("users");
    Meteor.subscribe("discussions");

    return {
      users: Meteor.users.find().fetch(),
      discussions: Discussions.find().fetch(),
    };
  });

  return (
    <Container>
      <Form as={Segment} attached="bottom">
        <Form.Dropdown
          label="Discussion"
          loading={discussions.length === 0}
          selection
          multiple
          options={discussions.map((discussion) => ({
            key: discussion._id,
            text: discussion.title,
            description: discussion.description,
            value: discussion._id,
          }))}
          name="discussions"
          value={discussionSet}
          onChange={(e, { value }) => setDiscussionSet(value.concat())}
        />
        <Form.Input
          label="Name"
          type="text"
          value={groupName}
          onInput={({ target }) => setGroupName(target.value)}
        />
        <Form.Field control={Form.Group} label="Members">
          <Form.Dropdown
            width={14}
            loading={users.length === 0}
            selection
            multiple
            search
            options={users.map((user) => ({
              key: user._id,
              text: user.username,
              value: user._id,
            }))}
            name="members"
            value={members}
            onChange={(e, { value }) => setMembers(value.concat())}
          />
        </Form.Field>
        <Form.Button
          content="Submit"
          onClick={() =>
            groupName != "" &&
            members.length > 1 &&
            Meteor.call("groups.create", groupName, members, discussionSet)
          }
        />
      </Form>
    </Container>
  );
};
