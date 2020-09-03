import React, { useState } from "react";
import RichTextEditor from "react-rte";
import {Form} from "semantic-ui-react";

export const CommentForm = ({ discussionId }) => {

    const [editorValue, setEditorValue] =
        useState(RichTextEditor.createEmptyValue());

    const handleChange = (value) => {
        setEditorValue(value);
    };

    const handleSubmit = () => {
          if (!editorValue) return; // If text is empty, don't submit anything.
          Meteor.call("comments.insert", editorValue.toString('markdown'), discussionId);
          console.log(editorValue.toString('markdown'));
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
            type="string"
            style={{ minHeight: 100 }}
            autoFocus
            multiline
            required
        >
        </RichTextEditor>
            <button onClick={handleSubmit}>Add Comment</button>
        </Form>
    );
};
