import React from "react";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";

export const DiscussionTemplateSummary = ({ template }) => {
  return (
    <List.Item as={Link} to={`/discussionTemplates/${template._id}`}>
      <List.Content as={Segment}>
        <List.Header as={"h5"} content={template && template.name} />
        <List.Description content={template && template.name} />
      </List.Content>
    </List.Item>
  );
};
