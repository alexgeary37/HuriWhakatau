import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Modal, Button, Input, Form, Divider } from "semantic-ui-react";

export const ResetPasswordForm = ({ toggleModal }) => {
  const { token } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  let history = useHistory();

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (password === confirmedPassword) {
      Accounts.resetPassword(token, password);
      Meteor.loginWithPassword(username, password, function (error) {
        if (error) {
          setErr(error.message);
        } else {
          toggleIt(e);
        }
      });
      history.push("/mydashboard");
    } else {
      setErr("Confirmed password does not match password");
    }
  };

  const toggleIt = () => {
    toggleModal();
  };

  console.log(err);
  return (
    <Modal
      open={true}
      closeOnDimmerClick={false}
      size="mini"
      style={{ padding: "10px" }}
    >
      <Modal.Header>Reset your password</Modal.Header>
      <Form>
        <Modal.Content>
          <Input
            label="Username"
            labelPosition="left"
            type="text"
            placeholder="Username"
            name="username"
            fluid
            autoFocus
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
            fluid
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Input
            label="Confirm Password"
            labelPosition="left"
            type="password"
            placeholder="Password"
            name="confirmedPassword"
            fluid
            onChange={(e) => setConfirmedPassword(e.currentTarget.value)}
          />
          {err ? (
            <div style={{ height: "10px", color: "red" }}>{err}</div>
          ) : (
            <div style={{ height: "10px" }} />
          )}
        </Modal.Content>
        <Divider />
        <Modal.Actions>
          <Button
            type={"button"}
            content="Cancel"
            color="black"
            onClick={(e) => toggleIt(e)}
          />
          <Button
            content="Reset My Password"
            labelPosition="right"
            icon="check"
            onClick={(e) => {
              submit(e);
              setIsLoading(true);
            }}
            positive
            loading={isLoading && !err}
            floated={"right"}
          />
        </Modal.Actions>
      </Form>
    </Modal>
  );
};
