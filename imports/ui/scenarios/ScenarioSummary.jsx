import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Button, List, Segment } from "semantic-ui-react";
import { DiscussionTemplates } from "/imports/api/discussionTemplates";
import { ViewScenario } from "/imports/ui/scenarios/ViewScenario";

export const ScenarioSummary = ({ scenario }) => {
  const [isOpenScenarioDisplay, setIsOpenScenarioDisplay] = useState(false);

  const toggleIt = () => {
    setIsOpenScenarioDisplay(!isOpenScenarioDisplay);
  };

  const { discussionTemplate } = useTracker(() => {
    const templatesSub = Meteor.subscribe("discussionTemplates");
    let template;
    if (templatesSub.ready()) {
      template = DiscussionTemplates.findOne({
        _id: scenario.discussionTemplateId,
      });
    }

    return {
      discussionTemplate: template,
    };
  });

  return (
    <List.Item>
      <List.Content
        as={Segment}
        style={{
          backgroundColor: "#c4c4c4",
        }}
      >
        <List.Header as={"h4"} content={scenario && scenario.title} />
        <List.Description
          content={discussionTemplate && "Template: " + discussionTemplate.name}
        />
        <Button content={"open"} onClick={toggleIt} />
        {isOpenScenarioDisplay && scenario && discussionTemplate && (
          <ViewScenario
            toggleModal={toggleIt}
            scenario={scenario}
            template={discussionTemplate}
          />
        )}
      </List.Content>
    </List.Item>
  );
};
