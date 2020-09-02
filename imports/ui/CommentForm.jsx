import React, { useState } from "react";
import RichTextEditor from "react-rte";
import {Form} from "semantic-ui-react";

export const CommentForm = ({ discussionId }) => {

    const [editorValue, setEditorValue] =
        useState(RichTextEditor.createEmptyValue());

    const handleChange = (value) => {
        setEditorValue(value);
        // setValue(value.toString("markdown"));
    };

    const handleSubmit = () => {
          if (!editorValue) return; // If text is empty, don't submit anything.
          Meteor.call("comments.insert", editorValue.toString('markdown'), discussionId);
          setEditorValue(RichTextEditor.createEmptyValue());
        };

    const toolbarConfig = {
        // Optionally specify the groups to display (displayed in the order listed).
        display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
        INLINE_STYLE_BUTTONS: [
            {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
            {label: 'Italic', style: 'ITALIC'},
            {label: 'Underline', style: 'UNDERLINE'}
        ],
        BLOCK_TYPE_DROPDOWN: [
            {label: 'Normal', style: 'unstyled'},
            {label: 'Heading Large', style: 'header-one'},
            {label: 'Heading Medium', style: 'header-two'},
            {label: 'Heading Small', style: 'header-three'}
        ],
        BLOCK_TYPE_BUTTONS: [
            {label: 'UL', style: 'unordered-list-item'},
            {label: 'OL', style: 'ordered-list-item'}
        ]
    };

    return (
        <Form>
        <RichTextEditor
            value={editorValue}
            onChange={handleChange}
            toolbarConfig={toolbarConfig}
            // id="body-text"
            // name="bodyText"
            type="string"
            // variant="filled"
            style={{ minHeight: 50 }}
            autoFocus
            multiline
            required
        >
        </RichTextEditor>
            <button onClick={handleSubmit}>Add Comment</button>
        </Form>
    );




  // 'setText' is a function we're declaring in the state of this
  // component in order to change the value of 'text'.
  // const [text, setText] = useState(""); // "" is the default value for 'text'.
  //
  // const handleSubmit = () => {
  //   if (!text) return; // If text is empty, don't submit anything.
  //   Meteor.call("comments.insert", text.trim(), discussionId);
  //   setText("");
  // };
  //
  // return (
  //   <div className="comment-form">
  //     <input
  //       type="text"
  //       placeholder="Type your comment here..."
  //       value={text}
  //       onChange={(e) => setText(e.target.value)}
  //       autoFocus
  //     />
  //     <button onClick={handleSubmit}>Add Comment</button>
  //   </div>
  // );
};
