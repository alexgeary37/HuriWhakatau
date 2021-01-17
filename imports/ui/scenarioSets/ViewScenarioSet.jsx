import React, { useState } from "react";
import { Checkbox, Modal, Button, Header } from "semantic-ui-react";
import { useTracker } from "meteor/react-meteor-data";
import { Scenarios } from "/imports/api/scenarios";

export const ViewScenarioSet = ({ toggleModal, scenarioSet }) => {
  const title = scenarioSet.title;
  const description = scenarioSet.description;
  const isRandomised = scenarioSet.randomise;

  const toggleIt = () => {
    toggleModal();
  };

  const { scenarios } = useTracker(() => {
    Meteor.subscribe("scenarios");

    return {
      scenarios: Scenarios.find({
        _id: { $in: scenarioSet.scenarios },
      }).fetch(),
    };
  });

  return (
    <Modal
      open={true}
      closeOnDimmerClick={false}
      size="small"
    >
      <Modal.Header>Scenario Set: {title}</Modal.Header>
      <Modal.Content>
        <Header as={"h4"} content={"Description:"} />
        {description}
        <br />
        <Checkbox
          disabled
          readOnly
          checked={isRandomised}
          label="Scenarios are in random order"
        />
        <Header as={"h4"} content={"Scenarios:"} />
        {scenarios &&
          scenarios.map((scenario) => (
            <div key={scenario._id}>
              <b>Title:</b>
              {scenario.title}
            </div>
          ))}
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={toggleIt}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
