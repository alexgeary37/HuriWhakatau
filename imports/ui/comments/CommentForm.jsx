import React, {useEffect, useRef, useState} from "react";
import RichTextEditor from "react-rte";
import {Button, Form, Segment} from "semantic-ui-react";

export const CommentForm = ({discussionId, displayForm, isDiscussionPublic, isUserAGroupMember, groupId}) => {
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
    };

    const keystroke = (event) => {
        let stroke = {
            k: event.key,
            t: Date.now(),
        };
        setKeyStrokes(keyStrokes => [...keyStrokes, stroke]);
    };

    // start of function to add macrons to letters if alt or alt + shift is pressed. Things crash pretty
    // quick if you try to use it though, suspect to do with the range.collapse(false) had issues with that before
    const macronise = (e) => {
        let sel, range;
        if (e.altKey && ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"].includes(e.key)) {
            e.preventDefault();
            if (window.getSelection) {
                sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    console.log("range count: ", sel.rangeCount);
                    range = sel.getRangeAt(0);
                    console.log(sel);
                    range.setStart(sel.focusNode, sel.focusOffset);
                    let newOffset = sel.focusOffset + 1;
                    switch (e.key) {
                        case 'a': /* e.preventDefault(); */
                            range.insertNode(document.createTextNode("ā"));
                            break;
                        case 'A':
                            e.preventDefault()
                            range.insertNode(document.createTextNode("Ā"));
                            break;
                        case 'e':
                            range.insertNode(document.createTextNode("ē"));
                            break;
                        case 'E':
                            range.insertNode(document.createTextNode("Ē"));
                            break;
                        case 'i':
                            range.insertNode(document.createTextNode("ī"));
                            break;
                        case 'I':
                            range.insertNode(document.createTextNode("Ī"));
                            break;
                        case 'o':
                            range.insertNode(document.createTextNode("ō"));
                            break;
                        case 'O':
                            range.insertNode(document.createTextNode("Ō"));
                            break;
                        case 'u':
                            range.insertNode(document.createTextNode("ū"));
                            break;
                        case 'U':
                            range.insertNode(document.createTextNode("Ū"));
                            break;
                        default:
                            break;
                    }
                    // sel.collapse(textNode, textNode.length+newOffset);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    //todo, fix this. always jumps back to second position in the text on
                    // first try and then enters character
                }
            }
        }
    };


    //detect pasting into the form and get what was pasted.
    // should save this somewhere and add to comment when submitted
    useEffect(() => {
        const editorContent = document.getElementsByClassName("public-DraftEditor-content")[0];
        editorContent.addEventListener('paste', (event) => {
            pasted(event)
        });
        editorContent.addEventListener('keypress', (event) => {
            keystroke(event)
        });
        //adds macrons to vowels
        editorContent.addEventListener('keydown', (event) => {
            macronise(event)
        });
    }, []);

    const handleChange = (value) => {
        setEditorValue(value);
    };

    const handleSubmit = () => {
        // if (typeof (editorValue.editorValue) == "undefined") { /this intended to prevent empty comments but doesn't work
        //     return;
        // } // If text is empty, don't submit anything.

        //todo need to replace this with an authenticated route for group members? how would that work?
        if (!isDiscussionPublic && !isUserAGroupMember){
            return;
        } else if (isDiscussionPublic && !isUserAGroupMember){
            Meteor.call("groups.updateMembers", groupId, Meteor.userId());
        }

        Meteor.call(
            "comments.insert",
            editorValue.toString("markdown"),
            pastedItems,
            keyStrokes,
            discussionId
        );
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
            {displayForm &&
            <div>
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
            </div>
            }
        </Form>
    );
};
