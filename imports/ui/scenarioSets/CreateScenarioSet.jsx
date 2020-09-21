import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
import {Scenarios} from "/imports/api/scenarios";
// import { NavBar } from "/imports/ui/navigation/NavBar";

export const CreateScenarioSet = ({toggleModal}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [scenarioSet, setScenarios] = useState([]);
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
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
                    <Form.Input
                        label="Description"
                        type="text"
                        value={description}
                        onInput={({target}) => setDescription(target.value)}
                    />
                    <Form.Dropdown
                        label="Scenarios"
                        loading={scenarios && scenarios.length === 0}
                        selection
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
                    <Button
                        content="Save"
                        onClick={() => {
                            title !== "" &&
                            description !== "" &&
                            scenarioSet.length > 0 &&
                            Meteor.call(
                                "scenarioSets.create",
                                title,
                                description,
                                scenarioSet
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
