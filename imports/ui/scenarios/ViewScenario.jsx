import React, {useState} from "react";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button, Header} from "semantic-ui-react";
import {useTracker} from "meteor/react-meteor-data";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {Categories} from "../../api/categories";

export const ViewScenario = ({toggleModal, scenario, template}) => {
    const title = scenario.title;
    const description = scenario.description;
    const categoryIds = scenario.categoryIds;
    // const discussionTemplateId = scenario.discussionTemplateId;
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {
        categories
    } = useTracker(() => {
        Meteor.subscribe("categories");
        return {
            categories: Categories.find({_id: {$in: categoryIds}}).fetch(),
        };
    });

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
                    label="Title: "
                    type="text"
                    value={title}
                    // onInput={({target}) => setTitle(target.value)}
                />
                <Header as={'h4'} content={'Description: '}/><>{description}</>
                {/*<Form.Input*/}
                {/*    readOnly={true}*/}
                {/*    label="Description"*/}
                {/*    type="text"*/}
                {/*    value=*/}
                {/*        */}
                {/*    // onInput={({target}) => setDescription(target.value)}*/}
                {/*/>*/}

                {/*show catergories and discussion templates, get ids for db*/}
                <Header as={'h4'} content={'Categories: '}/>
                {categories && categories.map((category)=>(
                    <span key={category._id}>{category.title +" "}</span>
                ))}
                {/*<Form.Input*/}
                {/*    readOnly={true}*/}
                {/*    label="Category"*/}
                {/*    type="text"*/}
                {/*    value={category && category}*/}
                {/*    // onInput={({target}) => setDescription(target.value)}*/}
                {/*/>*/}
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
