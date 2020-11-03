import React, {useEffect, useState} from "react";
import { useTracker } from "meteor/react-meteor-data";
import {Button, List, Segment} from "semantic-ui-react";
import { DiscussionTemplates } from "/imports/api/discussionTemplate";
import { ViewScenario } from "/imports/ui/scenarios/ViewScenario";
import {ViewExperiment} from "../experiments/ViewExperiment";

export const ScenarioSummary = ({ scenario }) => {
  const [isOpenScenarioDisplay, setIsOpenScenarioDisplay] = useState(false);
  const toggleIt = () => {
    setIsOpenScenarioDisplay(!isOpenScenarioDisplay);
  }

  const { discussionTemplate } = useTracker(() => {
    const templatesSub = Meteor.subscribe("discussionTemplates");
    let template;
    if(templatesSub.ready()){
      console.log("ready")
      template = DiscussionTemplates.findOne({_id: scenario.discussionTemplateId });
    }

    return {
      discussionTemplate: template,
    };
  });
  const printTempl = () =>{
    console.log("template: ", discussionTemplate);
  }
  useEffect(printTempl,[discussionTemplate]);

  return (
    <List.Item /*as={Link} to={`/scenarios/${scenario._id}`}*/>
      <List.Content as={Segment} style={{
        backgroundColor: "#c4c4c4",
      }}>
        <List.Header as={'h4'} content={scenario && scenario.title} />
        {scenario._id}
        <List.Description
          content={discussionTemplate && "Template: " + discussionTemplate.name}
        />
        <Button content={'open'} onClick={toggleIt} />
        {/* show exp details */}
        {isOpenScenarioDisplay &&
        <ViewScenario
            toggleModal={toggleIt}
            scenario={scenario}
            template={discussionTemplate}/>
        }
      </List.Content>
    </List.Item>
  );
};
