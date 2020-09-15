import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Container, Segment, Form } from "semantic-ui-react";
import { NavBar } from "/imports/ui/navigation/NavBar";

export const AssignRoles = () => {
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const roles = ["ADMIN", "RESEARCHER"];

  const { users } = useTracker(() => {
    return {
      users: Meteor.users.find().fetch(),
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
            multiple
            options={roles.map((role) => ({
              key: role,
              text: role.toLowerCase(),
              // description: role,
              value: role,
            }))}
            name="roles"
            value={roleList}
            onChange={(e, { value }) => setRoleList(value.concat())}
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
              roleList.length > 0 &&
                userList.length > 0 &&
                Meteor.call("security.setRoles", userList, roleList);
              history.back();
            }}
          />
        </Form>
      </Container>
    </div>
  );
};
