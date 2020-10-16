import React, {useState} from "react";
import {Container, Segment, Form, Modal, Button, Checkbox} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {Groups} from "/imports/api/groups";

export const CreateExperiment = ({toggleModal, isWizard, toggleIsWizard}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [groupId, setGroupId] = useState("");
    const [scenarioSetId, setScenarioSetId] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [hasIntroduction, setHasIntroduction] = useState(false);
    const [errName, setErrName] = useState("");
    const [errDescription, setErrDescription] = useState("");
    const [errGroupId, setErrGroupId] = useState("");
    const [errScenarioSetId, setErrScenarioSetId] = useState("");

    const submitExperiment = (e) => {
        if (name.length === 0) {
            setErrName("Experiments must have a name");
        } else {
            setErrName("");
        }
        if (description.length === 0) {
            setErrDescription("Experiments must have a description");
        } else {
            setErrDescription("");
        }
        if (scenarioSetId.length === 0){
            setErrScenarioSetId("Experiments must have a scenario set");
        } else {
            setErrScenarioSetId("");
        }
        if (groupId.length === 0){
            setErrGroupId("Experiments must have a group");
        } else {
            setErrGroupId("");
        }
        if (name.length > 0 && description.length > 0 && scenarioSetId.length > 0 && groupId.length > 0) {
            Meteor.call(
                "experiments.create",
                name,
                description,
                groupId,
                scenarioSetId,
                hasIntroduction,
            );
            toggleIt(e);
        }
    }

    const toggleIt = (e) => {
        setIsOpen(false);
        toggleModal();
        if(isWizard && e.currentTarget.innerHTML === "Cancel"){
            toggleIsWizard();
        }
    }

    const {groups, scenarioSets} = useTracker(() => {
        Meteor.subscribe("groups");
        Meteor.subscribe("scenarioSets");

        //todo filter by user who created group
        return {
            groups: Groups.find().fetch(),
            scenarioSets: ScenarioSets.find().fetch(),
        };
    });

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
        >
            <Modal.Header>Create an Experiment</Modal.Header>
            <Modal.Content>
                <Form as={Segment} attached="bottom">
                    <Form.Input
                        label="Name"
                        type="text"
                        autoFocus
                        value={name}
                        onInput={({target}) => setName(target.value)}
                    />
                    {errName ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errName}</div>
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
                    {/*show groups and scenarioSets, get ids for db*/}
                    <Form.Dropdown
                        label="Group"
                        loading={groups.length === 0}
                        selection
                        search
                        options={
                            groups &&
                            groups.map((group) => ({
                                key: group._id,
                                text: group.name,
                                value: group._id,
                            }))
                        }
                        name="groups"
                        value={groupId}
                        onChange={(e, {value}) => setGroupId(value)}
                    />
                    {errGroupId ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errGroupId}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    <Form.Dropdown
                        label="Scenario Set"
                        loading={scenarioSets.length === 0}
                        selection
                        search
                        options={
                            scenarioSets &&
                            scenarioSets.map((scenarioSet) => ({
                                key: scenarioSet._id,
                                text: scenarioSet.title,
                                value: scenarioSet._id,
                            }))
                        }
                        name="discussion templates"
                        value={scenarioSetId}
                        onChange={(e, {value}) => setScenarioSetId(value)}
                    />
                    {errScenarioSetId ? (
                        <div style={{height: "10px", color: "red", marginTop:"-13px", marginBottom:"10px"}}>{errScenarioSetId}</div>
                    ) : (
                        <div style={{height: "10px", marginTop:"-13px", marginBottom:"10px"}}/>
                    )}
                    <Checkbox checked={hasIntroduction} label='Create an Introduction Lounge' onClick={(e, data) => setHasIntroduction(data.checked)}/>
                    <br/>
                    <br/>
                    <Button
                        content="Save & Close"
                        onClick={(e) => {
                            submitExperiment(e);
                        }}
                        positive
                    />
                    <Button color='black' onClick={(e) => {toggleIt(e)}}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};
