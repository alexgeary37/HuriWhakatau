import React, {useState} from "react";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
// import { NavBar } from "/imports/ui/navigation/NavBar";
import {useTracker} from "meteor/react-meteor-data";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {Topics} from "/imports/api/topics";

export const CreateScenario = ({toggleModal}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [topicId, setTopicId] = useState("");
    const [discussionTemplateId, setDiscussionTemplateId] = useState("");
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {topics, discussionTemplates} = useTracker(() => {
        Meteor.subscribe("topics");
        Meteor.subscribe("discussionTemplates");

        //todo filter by user
        return {
            topics: Topics.find().fetch(),
            discussionTemplates: DiscussionTemplates.find().fetch(),
        };
    });

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
        >
            <Modal.Header>Create a Scenario</Modal.Header>
            <Modal.Content>
                <Form as={Segment} attached="bottom">
                    <Form.Input
                        label="Title"
                        type="text"
                        autoFocus
                        value={title}
                        onInput={({target}) => setTitle(target.value)}
                    />
                    <Form.Input
                        label="Description"
                        type="text"
                        value={description}
                        onInput={({target}) => setDescription(target.value)}
                    />
                    {/*show topics and discussion templates, get ids for db*/}
                    <Form.Dropdown
                        label="Topic"
                        loading={topics.length === 0}
                        selection
                        options={
                            topics &&
                            topics.map((topic) => ({
                                key: topic._id,
                                text: topic.title,
                                description: topic.description,
                                value: topic._id,
                            }))
                        }
                        name="topics"
                        value={topicId}
                        onChange={(e, {value}) => setTopicId(value)}
                    />
                    <Form.Dropdown
                        label="Discussion Template"
                        loading={discussionTemplates.length === 0}
                        selection
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
                        onChange={(e, {value}) => setDiscussionTemplateId(value)}
                    />
                    <Button
                        content="Save"
                        onClick={() => {
                            title !== "" &&
                            description !== "" &&
                            topicId !== "" &&
                            discussionTemplateId !== "" &&
                            Meteor.call(
                                "scenarios.create",
                                title,
                                description,
                                topicId,
                                discussionTemplateId
                            );
                            toggleIt();
                            // history.back();
                        }}
                        positive
                    />
                    <Button color='black' onClick={toggleIt}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};
