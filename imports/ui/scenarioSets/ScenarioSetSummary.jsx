import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { List, Segment } from "semantic-ui-react";

export const ScenarioSetSummary = ({ scenarioSet }) => {
  const { discussionTemplate } = useTracker(() => {
    Meteor.subscribe("discussionTemplates");

    return {
      // discussionTemplate: DiscussionTemplates.findOne({ _id: scenario.discussionTemplateId}),
    };
  });

  return (
    <List.Item /*as={Link} to={`/scenarioSets/${scenarioSet._id}`}*/>
      <List.Content as={Segment}>
        <List.Header as={'h4'} content={scenarioSet && scenarioSet.title} />
        <List.Description
          content={scenarioSet && "desc: " + scenarioSet.description}
        />
      </List.Content>
    </List.Item>
  );
};
