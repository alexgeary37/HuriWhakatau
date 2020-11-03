import React, {useState} from "react";
import { Link } from "react-router-dom";
import {Button, List, Segment} from "semantic-ui-react";
import {DisplayDiscussionTemplate} from "./DisplayDiscussionTemplate";

export const DiscussionTemplateSummary = ({ template }) => {
  const [isOpenTemplateDisplay, setIsOpenTemplateDisplay] = useState(false);
  const toggleIt = () => {
    setIsOpenTemplateDisplay(!isOpenTemplateDisplay);
  }



  return (
      <span>
    <List.Item>
      <List.Content as={Segment} style={{
        backgroundColor: "#c4c4c4",
      }}>
        <List.Header as={"h4"} content={template && template.name} />
        <Button content={'open'} onClick={toggleIt} />
        {/* show template details */}
        {isOpenTemplateDisplay &&
        <DisplayDiscussionTemplate
            toggleModal={toggleIt}
            template={template}/>
        }
      </List.Content>
    </List.Item>
    </span>
  );
};
