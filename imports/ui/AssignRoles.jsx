import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Container, Segment, Form } from "semantic-ui-react";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { NavBar } from "./NavBar";

export const AssignRoles = () => {
  // const [scenarioSet, setScenarioSet] = useState("");
  const [userList, setUserList] = useState([]);
  // const [groupName, setGroupName] = useState("");
  const [role, setRole] = useState("");
  const roles = ["ADMIN", "RESEARCHER"];

  const { users } = useTracker(() => {
    // Meteor.subscribe("scenarioSets");

    return {
      users: Meteor.users.find().fetch(),
      // scenarioSets: ScenarioSets.find().fetch(),
    };
  });

  return (
    <div>
      <NavBar />
      <Container>
        <Form as={Segment} attached="bottom">
          <Form.Dropdown
            label="Which Roles do you want to assign?"
            selection
            options={roles.map((role) => ({
              key: role,
              text: role.toLowerCase(),
              description: role,
              value: role,
            }))}
            name="roles"
            value={role}
            onChange={(e, { value }) => setRole(value)}
          />
          <Form.Field control={Form.Group} label="userList">
            <Form.Dropdown
              width={14}
              loading={users.length === 0}
              selection
              multiple
              search
              options={
                users &&
                users.map((user) => ({
                  key: user._id,
                  text: user.username,
                  value: user._id,
                }))
              }
              name="userList"
              value={userList}
              onChange={(e, { value }) => setUserList(value.concat())}
            />
          </Form.Field>
          <Form.Button
            content="Submit"
            onClick={() => {
              role !== "" &&
                userList.length > 0 &&
                Meteor.call("security.setRoles", userList, role);
              history.back();
            }}
          />
        </Form>
      </Container>
    </div>
  );
};
