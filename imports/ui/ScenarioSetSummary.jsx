import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";
import { DiscussionTemplates } from "../api/discussionTemplate";

export const ScenarioSetSummary = ({ scenarioSet }) => {
    const { discussionTemplate } = useTracker(() => {
        Meteor.subscribe("discussionTemplates");

        return {
            // discussionTemplate: DiscussionTemplates.findOne({ _id: scenario.discussionTemplateId}),
        };
    });

  return (
    <List.Item as={Link} to={`/scenarioSets/${scenarioSet._id}`}>
      <List.Content as={Segment}>
        <List.Header content={scenarioSet && scenarioSet.title} />
        <List.Description content={scenarioSet && 'desc: ' + scenarioSet.description} />
      </List.Content>
    </List.Item>
  );
};
