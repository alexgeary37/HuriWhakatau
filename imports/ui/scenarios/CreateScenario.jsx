import React, { useEffect, useState } from "react";
import { Segment, Form, Input, Modal, Button } from "semantic-ui-react";
import { useTracker } from "meteor/react-meteor-data";
import { DiscussionTemplates } from "/imports/api/discussionTemplates";
import { Categories } from "../../api/categories";

export const CreateScenario = ({
  toggleModal,
  isWizard,
  toggleIsWizard,
  toggleNextModal,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState([]); //make dynamically get the "other" category
  const [discussionTemplateId, setDiscussionTemplateId] = useState("");
  const [errScenarioTitle, setErrScenarioTitle] = useState("");
  const [errScenarioDesc, setErrScenarioDesc] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errDiscussionTemplateId, setErrDiscussionTemplateId] = useState("");
  const titleRef = React.createRef();

  const submitScenario = (e) => {
    if (title.length === 0) {
      setErrScenarioTitle("Scenarios must have a title");
    } else {
      setErrScenarioTitle("");
    }
    if (description.length === 0) {
      setErrScenarioDesc("Scenarios must have a description");
    } else {
      setErrScenarioDesc("");
    }
    if (categoryId.length === 0) {
      setErrCategory("Scenarios must have at least 1 category");
    } else {
      setErrCategory("");
    }
    if (discussionTemplateId.length === 0) {
      setErrDiscussionTemplateId("Scenarios must have a discussion template");
    } else {
      setErrDiscussionTemplateId("");
    }

    if (
      title.length > 0 &&
      description.length > 0 &&
      categoryId.length > 0 &&
      discussionTemplateId.length > 0
    ) {
      Meteor.call(
        "scenarios.create",
        title,
        description,
        categoryId,
        discussionTemplateId
      );
      return true;
    }
    return false;
  };

  // Reset all input fields on the form
  const resetFields = () => {
    setTitle("");
    setDescription("");
    setCategoryId([]); //make dynamically get the "other" category
    setDiscussionTemplateId("");
    setErrScenarioTitle("");
    setErrScenarioDesc("");
    setErrCategory("");
    setErrDiscussionTemplateId("");
    titleRef.current.focus(); // This won't work because Form.Input is a function and cannot have a ref
  };

  const toggleIt = (e) => {
    toggleModal();
    if (isWizard && e.currentTarget.innerHTML !== "Cancel") {
      toggleNextModal();
    }
    if (isWizard && e.currentTarget.innerHTML === "Cancel") {
      toggleIsWizard();
    }
  };

  const { discussionTemplates, categories } = useTracker(() => {
    Meteor.subscribe("categories");
    Meteor.subscribe("discussionTemplates");

    //todo filter by user
    return {
      categories: Categories.find().fetch(),
      discussionTemplates: DiscussionTemplates.find().fetch(),
    };
  });

  const categorySelection = (value) => {
    setCategoryId((categoryId) => [...categoryId, value]);
  };

  // Add a new category
  const addCategory = (title) => {
    Meteor.call("categories.insert", title);
  };

  // Find id of category "other" to default the dropdown.
  const getOtherCategory = () => {
    const cat = categories.find((cat) => cat.title === "Other");
    if (cat && categoryId.length === 0) {
      setCategoryId([cat._id]);
    }
  };
  useEffect(getOtherCategory, [categories]);

  return (
    <Modal open={true} closeOnDimmerClick={false} size="small">
      <Modal.Header>Create a Scenario</Modal.Header>
      <Modal.Content>
        <Form as={Segment} attached="bottom">
          <Input
            label="Title"
            type="text"
            autoFocus
            value={title}
            onInput={({ target }) => setTitle(target.value)}
            ref={titleRef}
          />
          {errScenarioTitle ? (
            <div
              style={{
                height: "10px",
                color: "red",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            >
              {errScenarioTitle}
            </div>
          ) : (
            <div
              style={{
                height: "10px",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            />
          )}
          <Input
            label="Description"
            type="text"
            value={description}
            onInput={({ target }) => setDescription(target.value)}
          />
          {errScenarioDesc ? (
            <div
              style={{
                height: "10px",
                color: "red",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            >
              {errScenarioDesc}
            </div>
          ) : (
            <div
              style={{
                height: "10px",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            />
          )}
          {/*show catergories and discussion templates, get ids for db*/}
          <Form.Dropdown
            label="Category"
            loading={categories.length === 0}
            selection
            search
            multiple
            allowAdditions
            options={
              categories &&
              categories.map((category) => ({
                key: category._id,
                text: category.title,
                value: category._id,
              }))
            }
            name="categories"
            value={categoryId}
            onAddItem={(e, { value }) => addCategory(value)}
            onChange={(e, { value }) => setCategoryId(value.concat())}
          />
          {errCategory ? (
            <div
              style={{
                height: "10px",
                color: "red",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            >
              {errCategory}
            </div>
          ) : (
            <div
              style={{
                height: "10px",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            />
          )}
          <Form.Dropdown
            label="Discussion Template"
            loading={discussionTemplates.length === 0}
            selection
            search
            options={
              discussionTemplates &&
              discussionTemplates.map((discussionTemplate) => ({
                key: discussionTemplate._id,
                text: discussionTemplate.name,
                value: discussionTemplate._id,
              }))
            }
            name="discussion templates"
            value={discussionTemplateId}
            onChange={(e, { value }) => setDiscussionTemplateId(value)}
          />
          {errDiscussionTemplateId ? (
            <div
              style={{
                height: "10px",
                color: "red",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            >
              {errDiscussionTemplateId}
            </div>
          ) : (
            <div
              style={{
                height: "10px",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            />
          )}
          <Button
            content="Save & Close"
            onClick={(e) => {
              const submitted = submitScenario(e);
              if (submitted) {
                toggleIt(e);
              }
            }}
            positive
          />
          <Button
            content="Save & Create Another"
            onClick={(e) => {
              const submitted = submitScenario(e);
              if (submitted) {
                resetFields();
              }
            }}
            positive
          />
          <Button
            color="black"
            content="Cancel"
            onClick={(e) => {
              toggleIt(e);
            }}
          />
          {isWizard && (
            <Button
              floated="right"
              content={"Save & Create Scenario Set"}
              onClick={(e) => {
                const submitted = submitScenario(e);
                if (submitted) {
                  toggleIt(e);
                }
              }}
              positive
            />
          )}
        </Form>
      </Modal.Content>
    </Modal>
  );
};
