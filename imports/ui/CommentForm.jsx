import React, { useState } from "react";
import { Form, Button, Input } from "semantic-ui-react";

export const CommentForm = ({ discussionId }) => {
  // 'setText' is a function we're declaring in the state of this
  // component in order to change the value of 'text'.
  const [text, setText] = useState(""); // "" is the default value for 'text'.

  const handleSubmit = () => {
    if (!text) return; // If text is empty, don't submit anything.
    Meteor.call("comments.insert", text.trim(), discussionId);
    setText("");
    console.log("text::", text);
  };

  return (
    <Form>
      <Input
        type="text"
        placeholder="Type your comment here..."
        name="text"
        fluid
        onChange={(e) => setText(e.currentTarget.value)}
        focus
      >
        <input />
        <Button content="Post" onClick={handleSubmit} positive />
      </Input>
    </Form>
  );
};
