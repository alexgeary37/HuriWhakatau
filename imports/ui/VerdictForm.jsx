import React, { useState } from "react";
import { Modal, Button, Input, Label } from "semantic-ui-react";

export const VerdictForm = ({ discussionId }) => {
  const [text, setText] = useState(""); // "" is the default value for 'text'.
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything.
    Meteor.call("verdicts.insert", text.trim(), discussionId);
    setText("");
  };

  const handleCancel = () =>
    Meteor.call("discussions.removeProposer", discussionId);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      // trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>Propose a Verdict</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Input
            type="text"
            placeholder="Type your verdict here..."
            name="verdict"
            required
            onChange={(e) => setUsername(e.currentTarget.value)}
          >
            <Label>Verdict</Label>
            <input />
          </Input>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Cancel"
          color="black"
          onClick={() => {
            setOpen(false);
            handleCancel;
          }}
        />
        <Button
          content="Submit Verdict"
          labelPosition="right"
          icon="checkmark"
          onClick={handleSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
    // <div className="verdict-form">
    //   <input
    //     type="text"
    //     placeholder="Type your verdict here..."
    //     value={text}
    //     onChange={(e) => setText(e.target.value)}
    //   />
    //   <button onClick={handleSubmit}>Submit Verdict</button>
    //   <button onClick={handleCancel}>Cancel</button>
    // </div>
  );
};
