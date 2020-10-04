import React, {useEffect, useState} from "react";
import RichTextEditor from "react-rte";
import {Button, Form, Segment} from "semantic-ui-react";

export const CommentForm = ({discussionId}) => {
    const [keyStrokes, setKeyStrokes] = useState([]);
    const [pastedItems, setPastedItems] = useState([]);
    const [editorValue, setEditorValue] = useState(
        RichTextEditor.createEmptyValue()
    );
    //detect pasting into the form and get what was pasted.
    // should save this somewhere and add to comment when submitted
    useEffect (()=>{
        const elem = document.getElementsByClassName("public-DraftEditor-content");
        console.log(elem[0].classList);
        elem[0].addEventListener('paste', (event) => {
            let pastedItem = {
                i: event.clipboardData.getData('text/plain'),
                t: Date.now(),
            }
            // pastedItems.push(pastedItem);
            setPastedItems([...pastedItems, pastedItem]);
            console.log(pastedItem);
        });
    },[]);

    //keylogger code from: https://hackernoon.com/how-to-make-a-simple-xss-keylogger-ubn3uuj
    // again, store and submit with comment
    document.onkeypress = function (e) {
        let stroke = {
            k: e.key,
            t: Date.now(),
        };
        setKeyStrokes([...keyStrokes, stroke]);
        // keyStrokes.push(stroke);
        console.log(keyStrokes);
    }

    const handleChange = (value) => {
        setEditorValue(value);
    };

    const handleSubmit = () => {
        if (!editorValue) return; // If text is empty, don't submit anything.
        Meteor.call(
            "comments.insert",
            editorValue.toString("markdown"),
            pastedItems,
            keyStrokes,
            discussionId
        );
        console.log(editorValue.toString("markdown"));
        setEditorValue(RichTextEditor.createEmptyValue());
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
