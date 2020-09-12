import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const DiscussionSummary = ({discussion }) => {
  const { scenario } = useTracker(() => {
    Meteor.subscribe("scenarios");

    return {
      scenario: Scenarios.findOne({ _id: discussion.scenarioId }),
    };
  });

  return (
    <List.Item
        as={Link} to={`/discussion/${discussion._id}`}>
      <List.Content style={{
          backgroundColor: discussion.status === 'active' ? "#FFF" : "#d3d3d3",
      }} as={Segment}>
        <List.Header content={scenario && scenario.title} />
        <List.Description content={scenario && scenario.description} />
      </List.Content>
    </List.Item>
  );
};
