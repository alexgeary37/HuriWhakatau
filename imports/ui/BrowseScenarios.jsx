import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import {
  Container,
  Segment,
  Header,
  Grid,
  List,
  Button,
} from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const BrowseScenarios = () => {
  const { scenarios } = useTracker(() => {
    Meteor.subscribe("scenarios");

    return {
      scenarios: Scenarios.find().fetch(),
    };
  });

  return (
    <Container>
      <Segment attached="top" clearing>
        <Grid>
          <Grid.Column floated="left" width={4} verticalAlign="bottom">
            <Button
              content="Create New"
              as={Link}
              to="/scenarios/create"
              color="green"
              floated="left"
            />
          </Grid.Column>
        </Grid>
      </Segment>
      <List as={Segment} attached="bottom" divided relaxed="very">
        {scenarios &&
          scenarios.map((scenario) => (
            <List.Item
              key={scenario._id}
              as={Link}
              to={`/scenarios/${scenario._id}`}
            >
              <List.Content as={Header} content={scenario.title} />
              <List.Description content={scenario.description} />
            </List.Item>
          ))}
      </List>
    </Container>

    // <div className="browseScenarios">
    //   <h1>Scenarios</h1>
    //   <ul className="scenarios">
    //     {scenarios.map((scenario) => (
    //       <div className="scenarioContainer" key={scenario._id}>
    //         <Button content={scenario.name} as={Link} to={`/${scenario._id}`} />
    //       </div>
    //     ))}
    //   </ul>
    //   <Button content="Create Scenario" as={Link} to={"/scenarios/create"} />
    // </div>
  );
};
