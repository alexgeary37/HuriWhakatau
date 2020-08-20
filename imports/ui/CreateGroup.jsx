import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Container, Segment, Form } from "semantic-ui-react";
import { ScenarioSets } from "/imports/api/scenarioSets";

export const CreateGroup = () => {
  const [scenarioSet, setScenarioSet] = useState([]);
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const { users, scenarioSets } = useTracker(() => {
    Meteor.subscribe("users");
    Meteor.subscribe("scenarioSets");

    return {
      users: Meteor.users.find().fetch(),
      scenarioSets: ScenarioSets.find().fetch(),
    };
  });

  return (
    <Container>
      <Form as={Segment} attached="bottom">
        <Form.Input
          label="Name"
          type="text"
          value={groupName}
          onInput={({ target }) => setGroupName(target.value)}
        />
        <Form.Dropdown
          label="Scenario Set"
          loading={scenarioSets.length === 0}
          selection
          multiple
          options={scenarioSets.map((scenarioSet) => ({
            key: scenarioSet._id,
            text: scenarioSet.title,
            description: scenarioSet.description,
            value: scenarioSet._id,
          }))}
          name="scenarioSets"
          value={scenarioSet}
          onChange={(e, { value }) => setScenarioSet(value.concat())}
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
            scenarioSet.length == 1 &&
            Meteor.call("groups.create", groupName, members, scenarioSet)
          }
        />
      </Form>
    </Container>
  );
};
