import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {Groups} from "/imports/api/groups";
import {Experiments} from "/imports/api/experiments";
import {Modal, Button, Label, Form, Header, SegmentGroup, Segment} from "semantic-ui-react";
import React, {useEffect, useState} from "react";

export const ViewExperiment = ({experiment, toggleModal}) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {experimentDetails} = useTracker(() => {
        // const experimentSub = Meteor.subscribe("experiments");
        const groupSub = Meteor.subscribe("groups");
        const scenarioSub = Meteor.subscribe("scenarios");
        const scenarioSetSub = Meteor.subscribe("scenarioSets");

        let fetchedScenarioSet;
        let scenarioSet;
        let scenarioSetTitle;
        let scenarioSetDescription;
        let group;
        let groupName;
        let groupMembers = [];

        if (groupSub.ready() && scenarioSub.ready() && scenarioSetSub.ready()) {
            // experiment = Experiments.findOne({_id: experiment._id});
            fetchedScenarioSet = ScenarioSets.findOne({_id: experiment.scenarioSetId});
            if (fetchedScenarioSet) {
                scenarioSetTitle = fetchedScenarioSet.title;
                scenarioSetDescription = fetchedScenarioSet.description;
            }
            group = Groups.findOne({_id: experiment.groupId}, {fields: {members: 1, name: 1}});
            if (group) {
                group.members.forEach((memberId) => {
                    groupMembers.push(Meteor.users.findOne({_id: memberId}, {fields: {username: 1}}));
                });
                groupName = group.name;
            }
        }

        return {
            experimentDetails: {
                name: experiment.name,
                description: experiment.description,
                senarioset: {
                    title: scenarioSetTitle,
                    description: scenarioSetDescription
                },
                group: {
                    name: groupName,
                    members: groupMembers,
                }
            },
        };
    });

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
                    readOnly={true}
                    label="Description"
                    type="text"
                    value={experimentDetails.description}
                    // onInput={({target}) => setDescription(target.value)}
                />
                <Segment>
                    <Header as={'h3'} content={'Group: ' + experimentDetails.group.name}/>
                    <Header as={'h3'} content={'Members'}/>
                    {experimentDetails && experimentDetails.group.members.map((member) => (
                        <div key={member._id}>{member.username}</div>
                    ))}
                </Segment>
                <Segment>
                    <Header as={'h3'} content={'Scenario Set: ' + experimentDetails.senarioset.title}/>
                    <Header as={'h4'} content={'Description: '}/>
                    {experimentDetails.senarioset.description}
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
