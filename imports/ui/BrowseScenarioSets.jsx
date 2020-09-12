import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button, Container, List, Segment } from "semantic-ui-react";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { NavBar } from "./NavBar";

export const BrowseScenarioSets = () => {
  const { scenarioSets } = useTracker(() => {
    Meteor.subscribe("scenarioSets");

    return {
      scenarioSets: ScenarioSets.find().fetch(),
    };
  });

  return (
    <div>
      <NavBar />
      <Container>
        <Segment attached="top">
          <Button
            content="Create New"
            as={Link}
            to="/scenarioSets/create"
            color="green"
          />
        </Segment>
        <List as={Segment} attached="bottom" divided relaxed="very">
          {scenarioSets &&
            scenarioSets.map((set) => (
              <List.Item
                style={{ padding: 15 }}
                key={set._id}
                as={Link}
                to={`/scenarioSets/${set._id}`}
              >
                <List.Content
                  header={set.title}
                  content={set.description}
                  description={`${set.scenarios.length} scenarios`}
                />
              </List.Item>
            ))}
        </List>
      </Container>
    </div>
  );
};
