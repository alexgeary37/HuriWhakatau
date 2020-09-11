import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const DiscussionTemplateSummary = ({ template }) => {
  //${template._id}
  return (
    <List.Item as={Link} to={`/discussionTemplates/${template._id}`}>
      <List.Content as={Segment}>
        <List.Header as={'H5'} content={template && template.name} />
        <List.Description content={template && template.name} />
      </List.Content>
    </List.Item>
  );
};
