import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Container, Segment, Form } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const CreateScenarioSet = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scenarioSet, setScenarios] = useState([]);

  const { scenarios } = useTracker(() => {
    Meteor.subscribe("scenarios");

    return {
      scenarios: Scenarios.find().fetch(),
    };
  });

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
        <Form.Dropdown
          label="Scenarios"
          loading={scenarios.length === 0}
          selection
          multiple
          placeholder="Select scenarios for this set..."
          options={scenarios.map((scenario) => ({
            key: scenario._id,
            text: scenario.title,
            description: scenario.description,
            value: scenario._id,
          }))}
          name="scenarios"
          value={scenarioSet}
          onChange={(e, { value }) => setScenarios(value.concat())}
        />
        <Form.Button
          content="Submit"
          onClick={() =>
            title != "" &&
            description != "" &&
            scenarios.length > 0 &&
            Meteor.call("scenarioSets.create", title, description, scenarioSet)
          }
        />
      </Form>
    </Container>
  );
};
