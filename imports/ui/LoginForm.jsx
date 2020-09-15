import React, { useState } from "react";
import { Modal, Image, Button, Header, Input, Label } from "semantic-ui-react";
import { VerdictForm } from "./verdicts/VerdictForm";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(true);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword(username, password, function (error) {
      if (error) {
        setErr(error.message);
      }
    });
  };

  console.log(err);
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="mini"
      // trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>Please Login to continue</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Input
            label="Username"
            labelPosition="left"
            type="text"
            placeholder="Username"
            name="username"
            required
            onChange={(e) => setUsername(e.currentTarget.value)}
          />
          <br />
          <br />
          <Input
            label="Password"
            labelPosition="left"
            type="password"
            placeholder="Password"
            name="password"
            required
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          {err ? (
            <div style={{ height: "10px", color: "red" }}>{err}</div>
          ) : (
            <div style={{ height: "10px" }} />
          )}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancel" color="black" onClick={() => setOpen(false)} />
        <Button
          content="Login"
          labelPosition="right"
          icon="check"
          onClick={submit}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};
