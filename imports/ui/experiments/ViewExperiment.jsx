import { useTracker } from "meteor/react-meteor-data";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { Groups } from "/imports/api/groups";
import {
  Modal,
  Button,
  Header,
  Segment,
  Tab,
  ListItem,
  Grid,
} from "semantic-ui-react";
import React, { useState } from "react";
import { Discussions } from "../../api/discussions";
import { Scenarios } from "../../api/scenarios";

export const ViewExperiment = ({ experiment, toggleModal }) => {
  const toggleIt = () => {
    toggleModal();
  };

  const { experimentDetails } = useTracker(() => {
    const groupSub = Meteor.subscribe("groups");
    const scenarioSub = Meteor.subscribe("scenarios");
    const scenarioSetSub = Meteor.subscribe("scenarioSets");
    const discussionsSub = Meteor.subscribe("discussions");

    let fetchedScenarioSet;
    let discussions;
    let scenarioSetTitle;
    let scenarioSetDescription;
    let fetchedScenarios;
    let group;
    let groupName;
    let groupMembers = [];

    if (
      groupSub.ready() &&
      scenarioSub.ready() &&
      scenarioSetSub.ready() &&
      discussionsSub.ready()
    ) {
      fetchedScenarioSet = ScenarioSets.findOne({
        _id: experiment.scenarioSetId,
      });
      if (fetchedScenarioSet) {
        let scenarios = fetchedScenarioSet.scenarios;
        scenarioSetTitle = fetchedScenarioSet.title;
        scenarioSetDescription = fetchedScenarioSet.description;
        fetchedScenarios = Scenarios.find({ _id: { $in: scenarios } }).fetch();
      }

      group = Groups.findOne(
        { _id: experiment.groupId },
        { fields: { members: 1, name: 1 } }
      );
      if (group) {
        group.members.forEach((memberId) => {
          groupMembers.push(
            Meteor.users.findOne({ _id: memberId }, { fields: { username: 1 } })
          );
        });
        groupName = group.name;
      }
      discussions = Discussions.find(
        { _id: { $in: experiment.discussions } },
        { fields: { isHui: 1, scenarioId: 1 } }
      );
    }

    return {
      experimentDetails: {
        name: experiment.name,
        description: experiment.description,
        scenarioSet: {
          title: scenarioSetTitle,
          description: scenarioSetDescription,
        },
        scenarios: fetchedScenarios,
        group: {
          name: groupName,
          members: groupMembers,
        },
        discussions: discussions,
      },
    };
  });

  const exportDiscussion = (discussionId) => {
    Meteor.call("experiments.exportDiscussion", discussionId);
  };

  return (
    <Modal open={true} closeOnDimmerClick={false} size="small">
      <Modal.Header>
        Experiment - {experimentDetails && experimentDetails.name}
      </Modal.Header>
      <Modal.Content>
        <Tab
          menu={{ inverted: false }}
          panes={[
            {
              menuItem: "Experiment Group & Scenario Set",
              render: () => (
                <Tab.Pane style={{ border: "none" }}>
                  <Modal.Header>
                    Description: {experimentDetails.description}
                  </Modal.Header>
                  <Segment loading={!experimentDetails.group.name}>
                    <Header
                      as={"h3"}
                      content={"Group: " + experimentDetails.group.name}
                    />
                    <Header as={"h3"} content={"Members"} />
                    {experimentDetails &&
                      experimentDetails.group.members.map((member) => (
                        <div key={member._id}>{member.username}</div>
                      ))}
                  </Segment>
                  <Segment loading={!experimentDetails.scenarioSet.title}>
                    <Header
                      as={"h3"}
                      content={
                        "Scenario Set: " + experimentDetails.scenarioSet.title
                      }
                    />
                    <Header as={"h4"} content={"Description: "} />
                    {experimentDetails.scenarioSet.description}
                  </Segment>
                </Tab.Pane>
              ),
            },
            {
              menuItem: "Comment Ratings",
              render: () => (
                <Tab.Pane style={{ border: "none" }}>
                  <Grid columns={4}>
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
                    {experiment.ratings ? (
                      experiment.ratings
                        .filter((rating) => rating.rating != "")
                        .map((rating) => (
                          <Grid.Row key={rating.rating.length}>
                            <Grid.Column>
                              <ListItem description={rating.rating} />
                            </Grid.Column>
                            <Grid.Column>
                              <ListItem description={rating.responseType} />
                            </Grid.Column>
                            <Grid.Column>
                              <ListItem description={rating.scale} />
                            </Grid.Column>
                            <Grid.Column>
                              <ListItem
                                description={rating.reverse.toString()}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        ))
                    ) : (
                      <p>No ratings to show</p>
                    )}
                  </Grid>
                </Tab.Pane>
              ),
            },
            {
              menuItem: "Discussions",
              render: () => (
                <Tab.Pane style={{ border: "none" }}>
                  {experimentDetails.scenarios &&
                    experimentDetails.discussions &&
                    experimentDetails.discussions.map((discussion) => (
                      <h3 key={discussion._id}>
                        <a
                          href={
                            (discussion.isHui ? "/huichat/" : "/discussion/") +
                            discussion._id
                          }
                        >
                          Discussion Title:{" "}
                          {
                            experimentDetails.scenarios.filter(
                              (scenario) =>
                                scenario._id === discussion.scenarioId
                            )[0].title
                          }
                        </a>
                        &nbsp;&nbsp;
                        <Button
                          compact
                          positive
                          content={"Export discussion"}
                          onClick={() => {
                            exportDiscussion(discussion._id);
                          }}
                        />
                      </h3>
                    ))}
                </Tab.Pane>
              ),
            },
          ]}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button content={"Close"} color="black" onClick={toggleIt} />
      </Modal.Actions>
    </Modal>
  );
};
