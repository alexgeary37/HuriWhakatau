import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {Groups} from "/imports/api/groups";
import {Experiments} from "/imports/api/experiments";
import {Modal, Button, Label, Form, Header, SegmentGroup, Segment, Tab, List, ListItem, Grid} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import {Discussions} from "../../api/discussions";
import {Comments} from "../../api/comments";
import {Scenarios} from "../../api/scenarios";
import {Categories} from "../../api/categories";
import {DiscussionTemplates} from "../../api/discussionTemplate";

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
                scenarioSet: {
                    title: scenarioSetTitle,
                    description: scenarioSetDescription
                },
                group: {
                    name: groupName,
                    members: groupMembers,
                },
                discussions: experiment.discussions,
            },
        };
    });

    const exportDiscussion = (discussionId) => {
        Meteor.call("experiments.exportDiscussion", discussionId);
    }

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            closeOnDimmerClick={false}
            size="small"
        >
            <Modal.Header>Experiment - {experimentDetails && experimentDetails.name}</Modal.Header>
            <Modal.Content>
                <Tab menu={{inverted: false}} panes={
                    [
                        {
                            menuItem: 'Experiment Group & Scenario Set', render: () =>
                                <Tab.Pane style={{border: 'none'}}>
                                    <Modal.Header>Description: {experimentDetails.description}</Modal.Header>
                                    <Segment loading={!experimentDetails.group.name}>
                                        <Header as={'h3'} content={'Group: ' + experimentDetails.group.name}/>
                                        <Header as={'h3'} content={'Members'}/>
                                        {experimentDetails && experimentDetails.group.members.map((member) => (
                                            <div key={member._id}>{member.username}</div>
                                        ))}
                                    </Segment>
                                    <Segment loading={!experimentDetails.scenarioSet.title}>
                                        <Header as={'h3'}
                                                content={'Scenario Set: ' + experimentDetails.scenarioSet.title}/>
                                        <Header as={'h4'} content={'Description: '}/>
                                        {experimentDetails.scenarioSet.description}
                                    </Segment>
                                </Tab.Pane>
                        },
                        {
                            menuItem: 'Comment Ratings', render: () =>
                                <Tab.Pane style={{border: 'none'}}>
                                    <Grid columns={4}>

                                        {/*<List horizontal relaxed={'very'} size={'big'}>*/}
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Header>Rating</Header>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Header>Response Type</Header>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Header>Scale points</Header>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Header>Reverse Scoring</Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                        {/*    </List>*/}
                                        {/*    <br/>*/}
                                        {/*</div>*/}
                                        {experiment.ratings ? experiment.ratings.filter(rating => rating.rating != "").map((rating) => (
                                            <Grid.Row>
                                                <Grid.Column>
                                                    {/*<List horizontal relaxed={'very'} size={'big'}>*/}
                                                    <ListItem description={rating.rating}/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <ListItem description={rating.responseType}/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <ListItem description={rating.scale}/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <ListItem description={rating.reverse.toString()}/>
                                                </Grid.Column>
                                                {/*</List>*/}
                                                {/*<br/>*/}
                                            </Grid.Row>
                                        )) : <p>No ratings to show</p>
                                        }
                                    </Grid>

                                </Tab.Pane>
                        },
                        {
                            menuItem: 'Discussions', render: () =>
                                <Tab.Pane style={{border: 'none'}}>
                                    {experimentDetails.discussions && experimentDetails.discussions.map((id) => (
                                        <h3 key={id}>
                                            <a href={'/discussion/' + id}>Discussion {experimentDetails.discussions.indexOf(id) + 1}</a>
                                            <Button content={'Export discussion'} onClick={() => {exportDiscussion(id)}}/>
                                        </h3>
                                    ))}
                                </Tab.Pane>
                        }]
                }/>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={toggleIt}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
