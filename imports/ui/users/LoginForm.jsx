import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal, Button, Input, Form, Divider, Link } from "semantic-ui-react";

export const LoginForm = ({ toggleModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  let history = useHistory();

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        setErr(error.message);
      } else {
        toggleIt(e);
        history.push("/mydashboard");
      }
    });
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
      <Modal.Header>Please Login to continue</Modal.Header>
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
          {err ? (
            <div style={{ height: "10px", color: "red" }}>{err}</div>
          ) : (
            <div style={{ height: "10px" }} />
          )}
          {/* This whole block below does not work. It throws a browser error saying User not found */}
          <Button
            type={"button"}
            content="Forgot my password"
            onClick={() => setForgotPassword(true)}
          />
          {forgotPassword && (
            <div>
              <Input
                label="Email"
                labelPosition="left"
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) => setEmailAddress(e.currentTarget.value)}
              />
              <Button
                content="Email me password"
                onClick={() => {
                  Accounts.forgotPassword({email: emailAddress})
                  toggleIt()
                }}
              />
              <Button
                content="Cancel"
                onClick={(e) => {
                  setEmailAddress("");
                  setForgotPassword(false);
                }}
              />
            </div>
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
            content="Login"
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
