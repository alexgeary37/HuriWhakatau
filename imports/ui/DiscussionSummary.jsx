import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const DiscussionSummary = ({ discussion }) => {
  const { title, description } = useTracker(() => {
    let sub = Meteor.subscribe("scenarios");

    let scenarioTitle = "";
    let scenarioDescription = "";

    // console.log(discussion.scenarioId);

    if (sub.ready()) {
      let scenario = Scenarios.findOne({ _id: discussion.scenarioId });
      scenarioTitle = scenario.title;
      scenarioDescription = scenario.description;
    }

    return {
      title: scenarioTitle,
      description: scenarioDescription,
    };
  });

  return (
    // to={`/${discussion._id}`}
    <List.Item as={Link} to={`/discussion/${discussion._id}`}>
      <List.Content as={Segment}>
        <List.Header content={title} />
        <List.Description content={description} />
      </List.Content>
    </List.Item>
  );
};
