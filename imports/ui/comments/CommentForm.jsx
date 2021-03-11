import React, { useEffect, useState } from "react";
import RichTextEditor from "react-rte";
import { Button, Form, Message } from "semantic-ui-react";
import { useTracker } from "meteor/react-meteor-data";
import { Discussions } from "../../api/discussions";

export const CommentForm = ({
  showTypingNotification,
  discussionId,
  isDiscussionPublic,
  isUserAGroupMember,
  groupId,
  displayScrollToBottomMessage,
  toggleScrollToBottomMessage
}) => {
  const [keyStrokes, setKeyStrokes] = useState([]);
  const [pastedItems, setPastedItems] = useState([]);
  const [editorValue, setEditorValue] = useState(
    RichTextEditor.createEmptyValue()
  );

  // console.log('keyStrokes:', keyStrokes);
  // console.log('keyStrokes.length:', keyStrokes.length);

  // useTracker makes sure the component will re-render when the data changes.
  const { user, typingUsers } = useTracker(() => {
    const subDiscussions = Meteor.subscribe("discussions");

    let discussionTypingUsersList;
    if (subDiscussions.ready()) {
      discussionTypingUsersList = Discussions.findOne(
        { _id: discussionId },
        { fields: { usersTyping: 1 } }
      );
    }

    return {
      user: Meteor.users.findOne(Meteor.userId()),
      typingUsers: discussionTypingUsersList,
    };
  });

  //detect pasting into the form and get what was pasted.
  // should save this somewhere and add to comment when submitted
  useEffect(() => {
    const editorContent = document.getElementsByClassName(
      "public-DraftEditor-content"
    )[0];
    editorContent.addEventListener("paste", (event) => {
      pasted(event);
    });
    editorContent.addEventListener("keypress", (event) => {
      keystroke(event);
    });
    //adds macrons to vowels
    editorContent.addEventListener("keydown", (event) => {
      if (
        event.altKey &&
        ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"].includes(event.key)
      ) {
        macronise(event);
      }
    });
  }, []);

  const handleChange = (value) => {
    setEditorValue(value);
  };

  const handleScrollToBottomClick = () => {
    console.log('TOGGLE')
    toggleScrollToBottomMessage()
  }

  const handleSubmit = () => {
    if (editorValue.toString("markdown").charCodeAt(0) === 8203) {
      return;
    } // If editor value first is empty, don't submit anything.

    //todo need to replace this with an authenticated route for group members? how would that work?
    if (!isDiscussionPublic && !isUserAGroupMember) {
      return;
    } else if (isDiscussionPublic && !isUserAGroupMember) {
      Meteor.call("groups.addMember", groupId, Meteor.userId()); // Meteor.userId() will be undefined.
    }

    Meteor.call(
      "comments.insert",
      editorValue.toString("markdown"),
      pastedItems,
      keyStrokes,
      discussionId,
      user.profile.emotion?.emotion
    );

    setEditorValue(RichTextEditor.createEmptyValue());
    setPastedItems([]);
    setKeyStrokes([]); // This is not the problem because it doesn't run on first render!!!!!!!!!!!!!!!!!!!!!!!!
  };

  //function for recording pastes
  const pasted = (event) => {
    let pastedItem = {
      item: event.clipboardData.getData("text/plain"),
      timestamp: Date.now(),
    };
    setPastedItems((pastedItems) => [...pastedItems, pastedItem]);
  };

  const keystroke = (event) => {
    let stroke = {
      key: event.key,
      timestamp: Date.now(),
    };
    // This does not run on the first render so this is not the problem!!!!!!!!!!!!!!!!!!!!!!
    setKeyStrokes((keyStrokes) => [...keyStrokes, stroke]);
  };

  //attempting to update discussion with user name of who is typing by monitoring the keyStrokes state
  // variable. user should be removed from discussion userTyping list after 2000 ms
  
  useEffect(() => {
    // console.log('ADD USER TO TYPING LIST:', user.username);
    Meteor.call("discussions.addUserToTypingList", discussionId, user.username);
  }, [keyStrokes]);

  // start of function to add macrons to letters if alt or alt + shift is pressed. Things crash pretty
  // quick if you try to use it though, suspect to do with the range.collapse(false) had issues with that
  // before. ***commenting out the code that doesn't work
  // todo look at modifying the editorValue rather than the dom element. would need to determine
  //   carat position and then insert the character there.
  const macronise = (e) => {
    let sel, range;
    if (
      e.altKey &&
      ["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"].includes(e.key)
    ) {
      e.preventDefault();
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.setStart(sel.focusNode, sel.focusOffset);
          let newOffset = sel.focusOffset + 1;
          switch (e.key) {
            case "a" /* e.preventDefault(); */:
              // range.insertNode(document.createTextNode("ā"));
              let content;
              break;
            case "A":
              // range.insertNode(document.createTextNode("Ā"));
              break;
            case "e":
              // range.insertNode(document.createTextNode("ē"));
              break;
            case "E":
              // range.insertNode(document.createTextNode("Ē"));
              break;
            case "i":
              // range.insertNode(document.createTextNode("ī"));
              break;
            case "I":
              // range.insertNode(document.createTextNode("Ī"));
              break;
            case "o":
              // range.insertNode(document.createTextNode("ō"));
              break;
            case "O":
              // range.insertNode(document.createTextNode("Ō"));
              break;
            case "u":
              // range.insertNode(document.createTextNode("ū"));
              break;
            case "U":
              // range.insertNode(document.createTextNode("Ū"));
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

  let typingUsernames = [];
  if (typingUsers && typingUsers.usersTyping.length > 0) {
    typingUsers.usersTyping.forEach((user) => {
      typingUsernames.push(user.user);
    });
  }

  return (
    <Form>
      <div>
        {showTypingNotification && (
          <div style={{ color: "white", height: "18px", bottomMargin: "5px" }}>
            {typingUsers &&
              typingUsers.usersTyping.length > 0 &&
              typingUsernames.join(", ") +
                (typingUsers.usersTyping.length === 1 ? " is" : " are") +
                " typing"}
          </div>
        )}
        {displayScrollToBottomMessage && (
          <Message
            content='See latest comments'
            onClick={handleScrollToBottomClick}
          />
        )}
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
        <Button
          content="Add Comment"
          attached={"bottom"}
          fluid
          positive
          onClick={handleSubmit}
        />
      </div>
    </Form>
  );
};
