import React, { useState } from "react";
import { Container, Segment, Form } from "semantic-ui-react";
import { NavBar } from "./NavBar";
import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "../api/scenarioSets";
import {DiscussionTemplates} from "../api/discussionTemplate";

export const CreateScenario = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
    const [topicId, setTopicId] = useState("");
    const [discussionTemplateId, setDiscussionTemplateId] = useState("");

    const { topics, discussionTemplates } = useTracker(() => {
        Meteor.subscribe("topics");
        Meteor.subscribe("discussionTemplates");

        //todo filter by user
        return {
            topics: Topics.find().fetch(),
            discussionTemplates: DiscussionTemplates.find().fetch(),
        };
    });

  return (
    <div>
      <NavBar />
      <Container>
        <Form as={Segment} attached="bottom">
          <Form.Input
            label="Title"
            type="text"
            value={title}
            onInput={({ target }) => setTitle(target.value)}
          />
          <Form.Input
            label="Description"
            type="text"
            value={description}
            onInput={({ target }) => setDescription(target.value)}
          />
          // show topics and discussion templates, get ids for db
            <Form.Dropdown
                label="Topic"
                loading={topics.length === 0}
                selection
                options={
                    topics &&
                    topics.map((topic) => ({
                        key: topics._id,
                        text: topics.title,
                        decription: topic.description,
                        value: topic._id,
                    }))
                }
                name="topics"
                value={topicId}
                onChange={(e, { value }) => setTopicId(value)}
            />
            <Form.Input
                label="Topic"
                type="text"
                value={topicId}
                onInput={({ target }) => setTopicId(target.value)}
            />
            <Form.Dropdown
                label="Discussion Template"
                loading={discussionTemplates.length === 0}
                selection
                options={
                    discussionTemplates &&
                    discussionTemplates.map((discussionTemplate) => ({
                        key: discussionTemplate._id,
                        text: discussionTemplate.title,
                        decription: topic.description,
                        value: topic._id,
                    }))
                }
                name="topics"
                value={topicId}
                onChange={(e, { value }) => setTopicId(value)}
            />
            <Form.Input
                label="Topic"
                type="text"
                value={topicId}
                onInput={({ target }) => setTopicId(target.value)}
            />
          <Form.Button
            content="Submit"
            onClick={() => {
              title != "" &&
              description != "" &&
              topicId != "" &&
              discussionTemplateId != "" &&
              Meteor.call("scenarios.create", title, description);
              history.back();}
            }
          />
        </Form>
      </Container>
    </div>
  );
};
