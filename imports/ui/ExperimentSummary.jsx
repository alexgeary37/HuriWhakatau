import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const ExperimentSummary = ({ experiment }) => {

  return (
    <List.Item as={Link} to={`/experiments/${experiment._id}`}>
      <List.Content as={Segment}>
        <List.Header content={experiment && experiment.name} />
        <List.Description content={experiment && 'Desc: ' + experiment.description} />
      </List.Content>
    </List.Item>
  );
};
