import React, {useState} from "react";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
import {useTracker} from "meteor/react-meteor-data";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {Categories} from "../../api/categories";

export const CreateScenario = ({toggleModal, isWizard, toggleIsWizard, toggleNextModal}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("5vQX4vhq3nbTWZ6Qe"); //make dynamically get the "other" category
    const [discussionTemplateId, setDiscussionTemplateId] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [errScenarioTitle, setErrScenarioTitle] = useState("");
    const [errScenarioDesc, setErrScenarioDesc] = useState("");
    const [errCategory, setErrCategory] = useState("");
    const [errDiscussionTemplateId, setErrDiscussionTemplateId] = useState("");

    const submitScenario = (e) => {
        if (title.length === 0) {
            setErrScenarioTitle("Scenarios must have a title")
        } else {
            setErrScenarioTitle("")
        }
        if (description.length === 0) {
            setErrScenarioDesc("Scenarios must have a description")
        } else {
            setErrScenarioDesc("")
        }
        if (categoryId.length === 0){
            setErrCategory("Scenarios must have a category")
        } else {
            setErrCategory("")
        }
        if (discussionTemplateId.length === 0){
            setErrDiscussionTemplateId("Scenarios must have a discussion template")
        } else {
            setErrDiscussionTemplateId("")
        }
        console.log("stuff that is submitted for scenario","title:", title, "desc:", description, "category:", categoryId, "discuss:", discussionTemplateId);

        if (title.length > 0 && description.length > 0 && categoryId.length > 0 && discussionTemplateId.length > 0) {
            console.log("creating scenario");
            Meteor.call(
                "scenarios.create",
                title,
                description,
                categoryId,
                discussionTemplateId
            );
            console.log("about to toggle");
            toggleIt(e);
        }
    }

    const toggleIt = (e) => {
        console.log("toggling");
        setIsOpen(false);
        toggleModal();
        if (isWizard && e.currentTarget.innerHTML !== "Cancel") {
            console.log(e.currentTarget.innerHTML);
            toggleNextModal();
        }
        if(isWizard && e.currentTarget.innerHTML === "Cancel"){
            toggleIsWizard();
        }
    }

    const {
        discussionTemplates,
        categories
        } = useTracker(() => {
        Meteor.subscribe("categories");
        Meteor.subscribe("discussionTemplates");


        //todo filter by user
        return {
            categories: Categories.find().fetch(),
            discussionTemplates: DiscussionTemplates.find().fetch(),
        };
    });
    console.log(categories);

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
                    {errScenarioTitle ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errScenarioTitle}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    <Form.Input
                        label="Description"
                        type="text"
                        value={description}
                        onInput={({target}) => setDescription(target.value)}
                    />
                    {errScenarioDesc ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errScenarioDesc}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    {/*show catergories and discussion templates, get ids for db*/}
                    <Form.Dropdown
                        label="Category"
                        loading={categories.length === 0}
                        selection
                        search
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
                        onChange={(e, {value}) => setCategoryId(value)}
                    />
                    {errCategory ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errCategory}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
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
                        onChange={(e, {value}) => setDiscussionTemplateId(value)}
                    />
                    {errDiscussionTemplateId ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errDiscussionTemplateId}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    <Button
                        content="Save & Close"
                        onClick={(e) => {
                            submitScenario(e);
                        }}
                        positive
                    />
                    <Button color='black' onClick={(e) => toggleIt(e)}>
                        Cancel
                    </Button>
                    {isWizard && <Button
                        floated="right"
                        content={"Save & Create Scenario Set"}
                        onClick={(e) => {
                            submitScenario(e)}}
                        positive />}
                </Form>
            </Modal.Content>
        </Modal>
    );
};
