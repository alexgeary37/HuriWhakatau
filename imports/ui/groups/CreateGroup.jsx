import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Segment, Form, Modal, Button } from "semantic-ui-react";

export const CreateGroup = ({
  toggleModal,
  isWizard,
  toggleIsWizard,
  toggleNextModal,
}) => {
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [errGroupName, setErrGroupName] = useState("");
  const [errGroupSize, setErrGroupSize] = useState("");
//   const nameRef = React.createRef();

  const submitGroup = (e) => {
    if (groupName.length === 0) {
      setErrGroupName("Groups must have a name");
    } else {
      setErrGroupName("");
    }
    if (members.length === 0) {
      setErrGroupSize("Groups must have at least one member");
    } else {
      setErrGroupName("");
    }
    if (groupName.length > 0 && members.length > 0) {
      Meteor.call("groups.create", groupName, members);
      return true;
    }
    return false;
  };

  const resetFields = () => {
    setMembers([]);
    setGroupName("");
    setErrGroupName("");
    setErrGroupSize("");
    // nameRef.current.focus(); // This won't work because Form.Input is a function and cannot have a ref
  }

  const toggleIt = (e) => {
    toggleModal();
    if (isWizard && e.currentTarget.innerHTML !== "Cancel") {
      toggleNextModal();
    }
    if (isWizard && e.currentTarget.innerHTML === "Cancel") {
      toggleIsWizard();
    }
  };

  const { users } = useTracker(() => {
    Meteor.subscribe("scenarioSets");

    return {
      users: Meteor.users.find().fetch(),
    };
  });

  return (
    <Modal open={true} closeOnDimmerClick={false} size="small">
      <Modal.Header>Create a Group</Modal.Header>
      <Modal.Content>
        <Form as={Segment} attached="bottom">
          <Form.Input
            label="Name"
            type="text"
            autoFocus
            // ref={nameRef}
            value={groupName}
            onInput={({ target }) => setGroupName(target.value)}
          />
          {errGroupName ? (
            <div
              style={{
                height: "10px",
                color: "red",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            >
              {errGroupName}
            </div>
          ) : (
            <div
              style={{
                height: "10px",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            />
          )}
          <Form.Field control={Form.Group} label="Members">
            <Form.Dropdown
              width={14}
              loading={users.length === 0}
              selection
              multiple
              search
              options={
                users &&
                users.map((user) => ({
                  key: user._id,
                  text: user.username,
                  value: user._id,
                }))
              }
              name="members"
              value={members}
              onChange={(e, { value }) => setMembers(value.concat())}
            />
          </Form.Field>
          {errGroupSize ? (
            <div
              style={{
                height: "10px",
                color: "red",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            >
              {errGroupSize}
            </div>
          ) : (
            <div
              style={{
                height: "10px",
                marginTop: "-13px",
                marginBottom: "10px",
              }}
            />
          )}
          <Button
            content="Save & Close"
            onClick={(e) => {
              const submitted = submitGroup(e);
              if (submitted) {
                toggleIt(e);
              }
            }}
            positive
          />
          <Button
            content="Save & Create Another"
            onClick={(e) => {
              const submitted = submitGroup(e);
              if (submitted) {
                resetFields();
              }
            }}
            positive
          />
          <Button
            content={"Cancel"}
            color="black"
            onClick={(e) => {
              toggleIt(e);
            }}
          />
          {isWizard && (
            <Button
              floated="right"
              content={"Save & Create Scenario"}
              onClick={(e) => {
                const submitted = submitGroup(e);
                if (submitted) {
                  toggleIt(e);
                }
              }}
              positive
            />
          )}
        </Form>
      </Modal.Content>
    </Modal>
  );
};
