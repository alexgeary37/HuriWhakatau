import React, { useState } from "react";
import { Container, Segment, Form } from "semantic-ui-react";

export const CreateScenario = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Container>
      <Form as={Segment} attached="bottom">
        <Form.Input
          label="Title"
          type="text"
          value={title}
          onInput={({ target }) => setTitle(target.value)}
        />
        <Form.Input
          label="Description"
          type="text"
          value={description}
          onInput={({ target }) => setDescription(target.value)}
        />
        <Form.Button
          content="Submit"
          onClick={() =>
            title != "" &&
            description != "" &&
            Meteor.call("scenarios.create", title, description)
          }
        />
      </Form>
    </Container>
  );
};
