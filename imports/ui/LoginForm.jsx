import React, { useState } from "react";
import {Modal, Image, Button, Header, Input, Label} from "semantic-ui-react";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(username, password);
  };

  return (
      <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button>Show Modal</Button>}
      >
        <Modal.Header>Please Login to continue</Modal.Header>
        <Modal.Content>
          <Modal.Description>

            <Input
                type="text"
                placeholder='Username'
                name="username"
                required
                onChange={(e) => setUsername(e.currentTarget.value)}>
              <Label>Username</Label>
              <input/>
            </Input>
            <Input
                type="password"
                placeholder="Password"
                name="password"
                required
                onChange={(e) => setPassword(e.currentTarget.value)}>
              <Label>Password</Label>
              <input/>
            </Input>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
              content="Login"
              labelPosition='right'
              icon='checkmark'
              onClick={submit}
              positive
          />
        </Modal.Actions>
      </Modal>
  );
};
