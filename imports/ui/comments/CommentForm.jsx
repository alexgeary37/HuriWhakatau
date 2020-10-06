import React, {useEffect, useRef, useState} from "react";
import RichTextEditor from "react-rte";
import {Button, Form, Segment} from "semantic-ui-react";

export const CommentForm = ({discussionId}) => {
    const [keyStrokes, setKeyStrokes] = useState([]);
    const [pastedItems, setPastedItems] = useState([]);
    const [editorValue, setEditorValue] = useState(
        RichTextEditor.createEmptyValue()
    );

    //function for recording pastes
    const pasted = (event) => {
        let pastedItem = {
            i: event.clipboardData.getData('text/plain'),
            t: Date.now(),
        }
        setPastedItems(pastedItems => [...pastedItems, pastedItem]);
        console.log(pastedItem);
    };

    const keystroke = (event) => {
        let stroke = {
            k: event.key,
            t: Date.now(),
        };
        setKeyStrokes(keyStrokes => [...keyStrokes, stroke]);
    };


    //detect pasting into the form and get what was pasted.
    // should save this somewhere and add to comment when submitted
    useEffect (()=>{
        const elem = document.getElementsByClassName("public-DraftEditor-content");
        console.log(elem[0].classList);
        elem[0].addEventListener('paste', (event) => { pasted(event) });
        elem[0].addEventListener('keypress', (event) => { keystroke(event) });
        },[]);

    const handleChange = (value) => {
        setEditorValue(value);
    };

    const handleSubmit = () => {
        if (typeof (editorValue.editorValue) == "undefined") {
            return;
        } // If text is empty, don't submit anything.
        Meteor.call(
            "comments.insert",
            editorValue.toString("markdown"),
            pastedItems,
            keyStrokes,
            discussionId
        );
        console.log(editorValue.toString("markdown"));
        setEditorValue(RichTextEditor.createEmptyValue());
        setPastedItems([]);
        setKeyStrokes([]);
    };

    const toolbarConfig = {
        // Optionally specify the groups to display (displayed in the order listed).
        INLINE_STYLE_BUTTONS: [
            {label: "Bold", style: "BOLD", className: "custom-css-class"},
            {label: "Italic", style: "ITALIC"},
            {label: "Strikethrough", style: "STRIKETHROUGH"},
            {label: "Blockquote", style: "blockquote"},
        ],
        BLOCK_TYPE_BUTTONS: [
            {label: "UL", style: "unordered-list-item"},
            {label: "OL", style: "ordered-list-item"},
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
                style={{minHeight: 100}}
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
