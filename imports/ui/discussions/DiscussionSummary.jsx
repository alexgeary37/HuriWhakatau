import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const DiscussionSummary = ({ discussion, participantRole }) => {
  const [isIndigenous, setIsIndigenous] = useState(participantRole);
  const { scenario } = useTracker(() => {
    Meteor.subscribe("scenarios");

    return {
      scenario: Scenarios.findOne({ _id: discussion.scenarioId }),
    };
  });
  // would like to set the path based on user role, but check is completed after
  // discussion summaries are loaded. need a call back in mydash or something
  let linkPath = isIndigenous ? "/huichat" : "/discussion";

  return (
    <List.Item as={Link} to={`${linkPath}/${discussion._id}`}>
      <List.Content
        style={{
          backgroundColor: discussion.status === "active" ? "#FFF" : "#d3d3d3",
        }}
        as={Segment}
      >
        <List.Header content={scenario && scenario.title} />
        <List.Description content={scenario && scenario.description} />
      </List.Content>
    </List.Item>
  );
};
