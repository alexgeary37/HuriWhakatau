import React, { useState } from "react";
import { Button, List, Segment } from "semantic-ui-react";
import { ViewScenarioSet } from "./ViewScenarioSet";

export const ScenarioSetSummary = ({ scenarioSet }) => {
  const [isOpenScenarioSetDisplay, setIsOpenScenarioSetDisplay] = useState(
    false
  );

  const toggleIt = () => {
    setIsOpenScenarioSetDisplay(!isOpenScenarioSetDisplay);
  };

  return (
    <List.Item>
      <List.Content
        as={Segment}
        style={{
          backgroundColor: "#c4c4c4",
        }}
      >
        <List.Header as={"h4"} content={scenarioSet && scenarioSet.title} />
        <List.Description
          content={scenarioSet && "desc: " + scenarioSet.description}
        />
        <Button content={"open"} onClick={toggleIt} />
        {/* show exp details */}
        {isOpenScenarioSetDisplay && scenarioSet && (
          <ViewScenarioSet toggleModal={toggleIt} scenarioSet={scenarioSet} />
        )}
      </List.Content>
    </List.Item>
  );
};
