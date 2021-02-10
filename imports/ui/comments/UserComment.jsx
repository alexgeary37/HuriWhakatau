import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Picker, Emoji } from "emoji-mart";
import { Button, Comment, Ref } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import RichTextEditor from "react-rte";
import "emoji-mart/css/emoji-mart.css";
import NotificationBadge from "react-notification-badge";

export const UserComment = ({
  comment,
  discussionStatus,
  userCanEdit,
  groupLeader,
  userInGroup,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [reactionShown, setReactionShown] = useState(false); // Controls the show or hide of the emoji picker.
  const [selectedEmojis, setSelectedEmojis] = useState(
    comment.emojis ? [...comment.emojis] : []
  );
  const isAuthor = Meteor.userId() === comment.authorId;

  // useTracker makes sure the component will re-render when the data changes.
  const { user } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      user: Meteor.users.findOne({ _id: comment.authorId }),
    };
  });

  //if the comment has an edited date format this for showing on the comment
  let editedDateTime, options, datetime;
  if (comment.editedDate) {
    editedDateTime = new Date(comment.editedDate);
    options = {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
    };
    datetime = new Intl.DateTimeFormat("en-AU", options).format(editedDateTime);
  }

  let userEmotion;
  if (comment.emotion) {
    switch (comment.emotion) {
      case "happy":
        userEmotion = "yellow";
        break;
      case "neutral":
        userEmotion = "white";
        break;
      case "unhappy":
        userEmotion = "#1E90FF";
        break;
      case "angry":
        userEmotion = "red";
        break;
      default:
        userEmotion = "white";
        break;
    }
  }

  //reference boolean for the useEffect callback sending the changed emoji list to the db
  const settingEmojisRef = useRef(false);
  //ensure the selectedEmojis state variable is finished updating before sending to db.
  useEffect(() => {
    if (settingEmojisRef.current) {
      settingEmojisRef.current = false;
      Meteor.call("comments.updateEmojis", selectedEmojis, comment._id);
    }
  }, [selectedEmojis]);

  useEffect(() => {
    //prevent context menu for comments the user is not the author of.
    if (!isAuthor) {
      const commentArea = document.getElementById(comment._id + ":text");
      commentArea.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
      //attempting to prevent ctrl + c copy
      commentArea.addEventListener("keydown", (event) => {
        if (event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }
  }, []);

  // // adding edit comment call
  const editComment = ({ _id }) => {
    let commentSpan = document.getElementById(_id + ":text");
    commentSpan.contentEditable = "true";
    let range = document.createRange();
    range.selectNodeContents(commentSpan);
    range.collapse(false); // supposed to set cursor to end of text but doesn't. todo
    commentSpan.focus();
  };

  //update comment call
  const updateComment = ({ _id }) => {
    let commentSpan = document.getElementById(_id + ":text");
    let text = RichTextEditor.createValueFromString(
      commentSpan.innerHTML,
      "html"
    ).toString("markdown");
    commentSpan.contentEditable = "false";
    Meteor.call("comments.update", text, _id);
  };
  
  //handle emoji selection; take event, get previous emoji
  // ids and add emoji if not exists.
  // add to count for current selected id.
  // hide picker.
  const handleEmojiSelect = (selection) => {
    let emoOb = { emoji: selection, count: 1, users: [Meteor.userId()] };
    let existingEmojiIds = comment.emojis.map(function (item) {
      return item.emoji.id;
    });
    console.log('Existing Emoji Ids:', existingEmojiIds);
    if (!existingEmojiIds.includes(emoOb.emoji.id)) {
      //trigger the useEffect callback to update db when selectedEmojis state variable has changed.
      settingEmojisRef.current = true;
      console.log('selectedEmojis:', selectedEmojis);
      setSelectedEmojis([...comment.emojis, emoOb]);
      setReactionShown(false);
      return;
    }

    let emojis = [...comment.emojis];
    emojis.forEach((emoObject) => {
      if (emoObject.emoji.id === emoOb.emoji.id) {
        emoObject.count += 1;
        emoObject.users = [...emoObject.users, ...emoOb.users];
      }
    });
    
    settingEmojisRef.current = true;
    setSelectedEmojis(emojis);
    setReactionShown(false);
  };

  //emojis to show in selector
  const customReactionEmojis = [
    {
      id: "+1",
      name: "+1",
      short_names: ["+1"],
      keywords: ["thumbsup"],
    },
    {
      id: "clap",
      name: "clap",
      short_names: ["clap"],
      keywords: ["clap"],
    },
    {
      id: "-1",
      name: "-1",
      short_names: ["-1"],
      keywords: ["thumbsdown"],
    },
    {
      id: "heart",
      name: "heart",
      short_names: ["heart"],
      keywords: ["heart"],
    },
  ];

  return (
    <Comment
      style={{
        margin: 20,
        backgroundColor: isAuthor ? "#EDE8FF" : "#F2F2F2",
        borderRadius: 5,
        border: "solid",
        borderWidth: 10,
        borderColor:
          isAuthor || groupLeader === Meteor.userId()
            ? userEmotion
              ? userEmotion
              : "#DFDBF0"
            : "#DFDBF0",
        padding: 5,
      }}
    >
      <Comment.Content>
        <Comment.Author as="a">{user && user.username}</Comment.Author>
        <Comment.Metadata>
          <div>{comment.postedTime.toDateString()}</div>
          {comment.editedDate && <div>(edited - {datetime})</div>}
        </Comment.Metadata>
        <Comment.Text id={comment._id + ":text"}>
          <ReactMarkdown source={comment.text} />
        </Comment.Text>
      </Comment.Content>
      <Comment.Actions>
        {isAuthor && userCanEdit && discussionStatus === "active" && (
          <div>
            <Button
              color="blue"
              content="Edit"
              size="mini"
              active={!isEditing}
              disabled={isEditing}
              onClick={() => {
                editComment(comment);
                setIsEditing(true);
              }}
            />
            <Button
              content="Save"
              size="mini"
              active={isEditing}
              disabled={!isEditing}
              onClick={() => {
                updateComment(comment);
                setIsEditing(false);
              }}
            />
          </div>
        )}
      </Comment.Actions>
      {discussionStatus === "active" && userInGroup && (
        <Button content="Add Reaction" size="mini" onClick={() => setReactionShown(true)} />
      )}
      {comment.emojis.map((emoji) => (
          <span
            key={emoji.emoji.id}
            style={{ marginRight: 17, margintop: 107 }}
          >
            <Emoji key={emoji.emoji.id} emoji={emoji.emoji} size={22}>
              <NotificationBadge
                key={emoji.emoji.id + ":count"}
                count={emoji.count}
                effect={[null, null, { top: "-3px" }, { top: "0px" }]}
                style={{
                  color: "black",
                  backgroundColor: "yellow",
                  top: "",
                  left: "",
                  bottom: "",
                  right: "-16px",
                  fontSize: "7px",
                }}
              />
            </Emoji>
          </span>
        ))}
      {reactionShown && (
        <div className="reactions">
          <Picker
            style={{ width: "auto" }}
            showPreview={false}
            showSkinTones={false}
            include={["custom"]}
            custom={customReactionEmojis}
            onSelect={handleEmojiSelect}
          />
        </div>
      )}
    </Comment>
  );
};
