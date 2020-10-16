import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {Groups} from "/imports/api/groups";
import {Experiments} from "/imports/api/experiments";
import {Modal, Button, Label} from "semantic-ui-react";
import React from "react";

export const ViewExperiment = ({experiment, toggleModal}) => {
    const {experimentDetails} = useTracker(() => {
        Meteor.subscribe("experiments");
        Meteor.subscribe("groups");
        Meteor.subscribe("scenarios");
        Meteor.subscribe("scenarioSets");

        let experiment = Experiments.findOne({_id: experiment._id});
        let scenarioSet = ScenarioSets.findOne({_id: experiment.scenarioSet});
        let group = Groups.findOne({_id: experiment.group});
        let groupMembers = {};
        group.forEach((member) => {
            groupMembers.push(Meteor.users.findOne({member}).username);
        });

        //todo filter by user
        return {
            experimentDetails: {
                name: experiment.name,
                description: experiment.description,
                senarioset: scenarioSet,
                group: {
                    name: group.name,
                    members: groupMembers,
                }
            },
        };
    });

    const handleToggleOpen = () => {
        toggleModal();
    }

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
        >
            <Modal.Header>Experiment - {experimentDetails && experimentDetails.name}</Modal.Header>
            <Modal.Content>
                <Form.Input
                    readOnly={"true"}
                    label="Description"
                    type="text"
                    value={experimentDetails.description}
                    onInput={({target}) => setDescription(target.value)}
                />
                <div>
                    <Label content={experimentDetails.group.name}/>
                        {experimentDetails && <p>
                            experimentDetails.group.members.map((member) => (
                            member)</p>
                        }
                </div>
                <div>
                    <Label content={experimentDetails.senarioset.title}/>
                    experimentDetails.senarioset.description
                </div>
                <Modal.Actions>
                    <Button color='black' onClick={handleToggleOpen}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal.Content>
        </Modal>
    );
};
