import React, { useState } from "react";
import { Button, List, Segment } from "semantic-ui-react";
import { ViewGroup } from "./ViewGroup";

export const GroupSummary = ({ group }) => {
  const [isOpenGroupDisplay, setIsOpenGroupDisplay] = useState(false);

  const toggleIt = () => {
    setIsOpenGroupDisplay(!isOpenGroupDisplay);
  };

  return (
    <List.Item>
      <List.Content
        as={Segment}
        style={{
          backgroundColor: "#c4c4c4",
        }}
      >
        <List.Header as={"h4"} content={group && group.name} />
        <Button content={"open"} onClick={toggleIt} />
        {isOpenGroupDisplay && (
          <ViewGroup toggleModal={toggleIt} group={group} />
        )}
      </List.Content>
    </List.Item>
  );
};
