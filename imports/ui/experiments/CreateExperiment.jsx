import React, {useState} from "react";
import {Container, Segment, Form, Modal, Button} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {Groups} from "/imports/api/groups";

export const CreateExperiment = ({toggleModal}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [groupId, setGroupId] = useState("");
    const [scenarioSetId, setScenarioSetId] = useState("");
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {groups, scenarioSets} = useTracker(() => {
        Meteor.subscribe("groups");
        Meteor.subscribe("scenarioSets");

        //todo filter by user
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
                    <Form.Input
                        label="Description"
                        type="text"
                        value={description}
                        onInput={({target}) => setDescription(target.value)}
                    />
                    {/*show groups and scenarioSets, get ids for db*/}
                    <Form.Dropdown
                        label="Group"
                        loading={groups.length === 0}
                        selection
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
                    <Form.Dropdown
                        label="Scenario Set"
                        loading={scenarioSets.length === 0}
                        selection
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
                    <Button
                        content="Save"
                        onClick={() => {
                            name !== "" &&
                            description !== "" &&
                            groupId !== "" &&
                            scenarioSetId !== "" &&
                            Meteor.call(
                                "experiments.create",
                                name,
                                description,
                                groupId,
                                scenarioSetId
                            );
                            toggleIt()
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
