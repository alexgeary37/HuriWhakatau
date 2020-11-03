import React, {useState} from "react";
import {Button, List, Segment} from "semantic-ui-react";
import {ViewExperiment} from "/imports/ui/experiments/ViewExperiment";

export const ExperimentSummary = ({ experiment }) => {
    const [isOpenExperimentDisplay, setIsOpenExperimentDisplay] = useState(false);
    const toggleIt = () => {
        setIsOpenExperimentDisplay(!isOpenExperimentDisplay);
    }

    return (
    <List.Item >
      <List.Content as={Segment} style={{
          backgroundColor: "#c4c4c4",
      }}>
        <List.Header as={'h4'} content={experiment && experiment.name} />
        <List.Description
          content={experiment && "Description: " + experiment.description}
        />
          <Button content={'open'} onClick={toggleIt} />
          {/* show exp details */}
          {isOpenExperimentDisplay &&
          <ViewExperiment
              toggleModal={toggleIt}
              experiment={experiment}/>
          }
      </List.Content>
    </List.Item>
  );
};
