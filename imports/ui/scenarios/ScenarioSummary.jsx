import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { List, Segment } from "semantic-ui-react";
import { DiscussionTemplates } from "/imports/api/discussionTemplate";

export const ScenarioSummary = ({ scenario }) => {
  const { discussionTemplate } = useTracker(() => {
    Meteor.subscribe("discussionTemplates");

    return {
      discussionTemplate: DiscussionTemplates.findOne({
        _id: scenario.discussionTemplateId,
      }),
    };
  });

  return (
    <List.Item /*as={Link} to={`/scenarios/${scenario._id}`}*/>
      <List.Content as={Segment}>
        <List.Header as={'h4'} content={scenario && scenario.title} />
        <List.Description
          content={discussionTemplate && "Template: " + discussionTemplate.name}
        />
      </List.Content>
    </List.Item>
  );
};
