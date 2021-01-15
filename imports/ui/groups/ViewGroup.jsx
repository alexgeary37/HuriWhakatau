import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Modal, Button, Header } from "semantic-ui-react";

export const ViewGroup = ({ toggleModal, group }) => {
  const toggleIt = () => {
    toggleModal();
  };

  const { members } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      members: Meteor.users.find({ _id: { $in: group.members } }).fetch(),
    };
  });

  const leaveGroup = () => {
    Meteor.call("groups.removeMember", group._id, Meteor.userId());
  };

  return (
    <Modal
      open={true}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>Group: {group.name}</Modal.Header>

      <Modal.Content>
        <Header as="h5" content="Group Members: " />
        {members &&
          members.map((member) => (
            <p key={member._id}>
              {member.username}
              <span>
                {member._id === Meteor.userId() && <span> (you)</span>}
              </span>
            </p>
          ))}
      </Modal.Content>
      <Modal.Actions>
        {members &&
          members.map((member) => (
            <span key={member._id}>
              {member._id === Meteor.userId() && (
                <Button
                  style={{ marginRight: "15px" }}
                  content={"Remove yourself from group"}
                  onClick={leaveGroup}
                />
              )}
            </span>
          ))}
        <Button content="Close" onClick={toggleIt} />
      </Modal.Actions>
    </Modal>
  );
};
