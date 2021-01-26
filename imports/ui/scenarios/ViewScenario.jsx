import React, { useState } from "react";
import { Segment, Form, Modal, Button, Header } from "semantic-ui-react";
import { useTracker } from "meteor/react-meteor-data";
import { Categories } from "../../api/categories";

export const ViewScenario = ({ toggleModal, scenario, template }) => {
  const title = scenario.title;
  const description = scenario.description;
  const categoryIds = scenario.categoryIds;
  const templateName = template.name;
  // const discussionTemplateId = scenario.discussionTemplateId;

  const toggleIt = () => {
    toggleModal();
  };

  const { categories } = useTracker(() => {
    Meteor.subscribe("categories");
    return {
      categories: Categories.find({ _id: { $in: categoryIds } })
        .fetch()
        .sort((a, b) => {
          // Sort categories by the order in which they appear in categoryIds.
          return categoryIds.indexOf(a._id) - categoryIds.indexOf(b._id);
        }),
    };
  });

  console.log("categories:", categories);

  return (
    <Modal open={true} closeOnDimmerClick={false} size="small">
      <Modal.Header>Scenario</Modal.Header>
      <Modal.Content>
        <Form.Input readOnly={true} label="Title: " type="text" value={title} />
        <Header as={"h4"} content={"Description: "} />
        <>{description}</>
        {/*show catergories and discussion templates, get ids for db*/}
        <Header as={"h4"} content={"Categories: "} />
        {categories &&
          categories.map((category) => (
            <span key={category._id}>{category.title + " "}</span>
          ))}
        <Segment>
          {
            <Header
              as={"h4"}
              content={"Discussion Template: " + templateName}
            />
          }
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={toggleIt}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
