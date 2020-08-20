import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { ScenarioSets } from "/imports/api/scenarioSets";

export const BrowseScenarioSets = () => {
  const { scenarioSets } = useTracker(() => {
    Meteor.subscribe("scenarioSets");

    return {
      scenarioSets: ScenarioSets.find().fetch(),
    };
  });

  return (
    <div className="browseScenarioSets">
      <h1>ScenarioSets</h1>
      <ul className="scenarioSets">
        {scenarioSets.map((scenarioSet) => (
          <div className="scenarioSetContainer" key={scenarioSet._id}>
            <Button
              content={scenarioSet.name}
              as={Link}
              to={`/${scenarioSet._id}`}
            />
          </div>
        ))}
      </ul>
      <Button
        content="Create ScenarioSet"
        as={Link}
        to={"/scenarioSets/create"}
      />
    </div>
  );
};
