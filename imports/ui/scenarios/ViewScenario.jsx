import React, {useState} from "react";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button, Header} from "semantic-ui-react";
import {useTracker} from "meteor/react-meteor-data";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {Categories} from "../../api/categories";

export const ViewScenario = ({toggleModal, scenario, template}) => {
    const title = scenario.title;
    const description = scenario.description;
    const categoryId = scenario.categoryId;
    // const discussionTemplateId = scenario.discussionTemplateId;
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {
        category
    } = useTracker(() => {
        Meteor.subscribe("categories");
        return {
            category: Categories.findOne({_id: categoryId}),
        };
    });
    console.log(category);

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            closeOnDimmerClick={false}
            size="small"
        >
            <Modal.Header>Scenario</Modal.Header>
            <Modal.Content>
                <Form.Input
                    readOnly={true}
                    label="Title"
                    type="text"
                    autoFocus
                    value={title}
                    // onInput={({target}) => setTitle(target.value)}
                />
                <Form.Input
                    readOnly={true}
                    label="Description"
                    type="text"
                    value={description}
                    // onInput={({target}) => setDescription(target.value)}
                />

                {/*show catergories and discussion templates, get ids for db*/}
                <Form.Input
                    readOnly={true}
                    label="Category"
                    type="text"
                    value={category && category.title}
                    // onInput={({target}) => setDescription(target.value)}
                />
                <Segment>
                    <Header as={'h4'} content={'Discussion Template: ' + template.name}/>
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                {/*<Button*/}
                {/*    content="Save & Close"*/}
                {/*    onClick={(e) => {*/}
                {/*        submitScenario(e);*/}
                {/*    }}*/}
                {/*    positive*/}
                {/*/>*/}
                <Button color='black' onClick={toggleIt}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
