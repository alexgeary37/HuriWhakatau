import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
import {Scenarios} from "/imports/api/scenarios";
// import { NavBar } from "/imports/ui/navigation/NavBar";

export const CreateScenarioSet = ({toggleModal, isWizard, toggleIsWizard, toggleNextModal}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [scenarioSet, setScenarios] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [errTitle, setErrTitle] = useState("");
    const [errDescription, setErrDescription] = useState("");
    const [errScenarioSet, setErrScenarioSet] = useState("");

    const submitScenarioSet = (e) => {
        if (title.length === 0) {
            setErrTitle("Scenarios must have a title")
        } else {
            setErrTitle("")
        }
        if (description.length === 0) {
            setErrDescription("Scenarios must have a description")
        } else {
            setErrDescription("")
        }
        if (scenarioSet.length === 0){
            setErrScenarioSet("Scenarios must have a topic")
        } else {
            setErrScenarioSet("")
        }

        if (title.length > 0 && description.length > 0 && scenarioSet.length > 0) {
            Meteor.call(
                "scenarioSets.create",
                title,
                description,
                scenarioSet
            );
            toggleIt(e);
        }
    }

    const toggleIt = (e) => {
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

    const {scenarios} = useTracker(() => {
        Meteor.subscribe("scenarios");

        return {
            scenarios: Scenarios.find().fetch(),
        };
    });

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
        >
            <Modal.Header>Create a Scenario Set</Modal.Header>
            <Modal.Content>
                <Form as={Segment} attached="bottom">
                    <Form.Input
                        label="Title"
                        type="text"
                        autoFocus
                        value={title}
                        onInput={({target}) => setTitle(target.value)}
                    />
                    {errTitle ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errTitle}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    <Form.Input
                        label="Description"
                        type="text"
                        value={description}
                        onInput={({target}) => setDescription(target.value)}
                    />
                    {errDescription ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errDescription}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    <Form.Dropdown
                        label="Scenarios"
                        loading={scenarios && scenarios.length === 0}
                        selection
                        search
                        multiple
                        placeholder="Select scenarios for this set..."
                        options={
                            scenarios &&
                            scenarios.map((scenario) => ({
                                key: scenario._id,
                                text: scenario.title,
                                description: scenario.description,
                                value: scenario._id,
                            }))
                        }
                        name="scenarios"
                        value={scenarioSet}
                        onChange={(e, {value}) => setScenarios(value.concat())}
                    />
                    {errScenarioSet ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errScenarioSet}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    <Button
                        content="Save"
                        onClick={(e) => {
                            submitScenarioSet(e);
                        }}
                        positive
                    />
                    <Button color='black' onClick={(e) =>{toggleIt(e)}}>
                        Cancel
                    </Button>
                    {isWizard && <Button
                        floated="right"
                        content={"Save & Create Experiment"}
                        onClick={(e) => {
                            submitScenarioSet(e)}}
                        positive />}
                </Form>
            </Modal.Content>
        </Modal>
    );
};
