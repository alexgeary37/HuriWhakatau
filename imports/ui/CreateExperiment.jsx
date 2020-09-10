import React, { useState } from "react";
import { Container, Segment, Form } from "semantic-ui-react";
import { NavBar } from "./NavBar";
import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "../api/scenarioSets";
import { Groups } from "../api/groups";

export const CreateExperiment = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
    const [groupId, setGroupId] = useState("");
    const [scenarioSetId, setScenarioSetId] = useState("");

    const { groups, scenarioSets } = useTracker(() => {
        Meteor.subscribe("groups");
        Meteor.subscribe("scenarioSets");

        //todo filter by user
        return {
            groups: Groups.find().fetch(),
            scenarioSets: ScenarioSets.find().fetch(),
        };
    });

  return (
    <div>
      <NavBar />
      <Container>
        <Form as={Segment} attached="bottom">
          <Form.Input
            label="Name"
            type="text"
            autoFocus
            value={name}
            onInput={({ target }) => setName(target.value)}
          />
          <Form.Input
            label="Description"
            type="text"
            value={description}
            onInput={({ target }) => setDescription(target.value)}
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
                onChange={(e, { value }) => setGroupId(value)}
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
                onChange={(e, { value }) => setScenarioSetId(value)}
            />
          <Form.Button
            content="Submit"
            onClick={() => {
              name !== "" &&
              description !== "" &&
              groupId !== "" &&
              scenarioSetId !== "" &&
              Meteor.call("experiments.create", name, description, groupId, scenarioSetId);
              history.back();}
            }
          />
        </Form>
      </Container>
    </div>
  );
};
