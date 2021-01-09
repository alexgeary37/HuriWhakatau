import React, {useState} from "react";
import {Segment, Form, Modal, Button, Header} from "semantic-ui-react";
import {useTracker} from "meteor/react-meteor-data";
import {Categories} from "../../api/categories";

export const ViewScenario = ({toggleModal, scenario, template}) => {
    const title = scenario.title;
    const description = scenario.description;
    const categoryIds = scenario.categoryIds;
    const templateName = template.name;
    // const discussionTemplateId = scenario.discussionTemplateId;
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {categories} = useTracker(() => {
        Meteor.subscribe("categories");
        return {
            categories: Categories.find({_id: {$in: categoryIds}}).fetch(),
        };
    });
    console.log('categories:', categories);

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
                />
                <Header as={'h4'} content={'Description: '}/><>{description}</>
                {/*show catergories and discussion templates, get ids for db*/}
                <Header as={'h4'} content={'Categories: '}/>
                {categories && categories.map((category) => (
                    <span key={category._id}>{category.title + " "}</span>
                ))}
                <Segment>
                    {<Header as={'h4'} content={'Discussion Template: ' + templateName}/>}
                </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={toggleIt}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
