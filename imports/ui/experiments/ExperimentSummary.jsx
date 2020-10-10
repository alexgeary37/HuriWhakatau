import React from "react";
import { List, Segment } from "semantic-ui-react";

export const ExperimentSummary = ({ experiment }) => {
  return (
    <List.Item >
      <List.Content as={Segment} style={{
          backgroundColor: "#c4c4c4",
      }}>
        <List.Header as={'h4'} content={experiment && experiment.name} />
        <List.Description
          content={experiment && "Description: " + experiment.description}
        />
      </List.Content>
    </List.Item>
  );
};
