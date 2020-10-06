import React, { useState } from "react";
import RichTextEditor from "react-rte";
import { Button, Form, Segment } from "semantic-ui-react";

export const CommentForm = ({ discussionId }) => {
  const [editorValue, setEditorValue] = useState(
    RichTextEditor.createEmptyValue()
  );

  const handleChange = (value) => {
    setEditorValue(value);
  };

  const handleSubmit = () => {
    if (!editorValue) return; // If text is empty, don't submit anything.
    Meteor.call(
      "comments.insert",
      editorValue.toString("markdown"),
      discussionId
    );
    console.log(editorValue.toString("markdown"));
    setEditorValue(RichTextEditor.createEmptyValue());
  };

  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Strikethrough", style: "STRIKETHROUGH" },
      { label: "Blockquote", style: "blockquote" },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
    display: ["INLINE_STYLE_BUTTONS", "BLOCK_TYPE_BUTTONS", "LINK_BUTTONS"],
  };

  return (
    <Form>
      <RichTextEditor
        value={editorValue}
        onChange={handleChange}
        toolbarConfig={toolbarConfig}
        type="string"
        style={{ minHeight: 100 }}
        autoFocus
        multiline
        required
      />

      <Button attached={"bottom"} fluid positive onClick={handleSubmit}>
        Add Comment
      </Button>
    </Form>
  );
};
