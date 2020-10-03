import React, {useState} from "react";
import { Link } from "react-router-dom";
import { List, Segment } from "semantic-ui-react";
import {DisplayDiscussionTemplate} from "./DisplayDiscussionTemplate";

export const DiscussionTemplateSummary = ({toggleModal, template }) => {
    //need to make the DisplayDiscussionTemplate Modal component show from clicking this component
    // const [isOpenTemplateDisplay, setIsOpenTemplateDisplay] = useState(false);
    // const handleToggleTemplateDisplay = () => {
    //     setIsOpenTemplateDisplay(!isOpenTemplateDisplay);
    // };
    // const toggleIt = () =>{
    //     toggleModal();
    // };
  const toggleIt = () => {
    // setIsOpen(false);
    toggleModal();
  }

  return (
      <span>
    <List.Item>
      <List.Content as={Segment}>
        <List.Header as={"h4"} content={template && template.name} />
        <Segment as={Link} onClick={toggleIt} content={"Hiiii"}/>
        {/*<List.Description content={template && template.description} />*/}
      </List.Content>
    </List.Item>
    </span>
  );
};
