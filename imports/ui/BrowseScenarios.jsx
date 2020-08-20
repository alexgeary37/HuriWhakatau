import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const BrowseScenarios = () => {
  const { scenarios } = useTracker(() => {
    Meteor.subscribe("scenarios");

    return {
      scenarios: Scenarios.find().fetch(),
    };
  });

  return (
    <div className="browseScenarios">
      <h1>Scenarios</h1>
      <ul className="scenarios">
        {scenarios.map((scenario) => (
          <div className="scenarioContainer" key={scenario._id}>
            <Button content={scenario.name} as={Link} to={`/${scenario._id}`} />
          </div>
        ))}
      </ul>
      <Button content="Create Scenario" as={Link} to={"/scenarios/create"} />
    </div>
  );
};
