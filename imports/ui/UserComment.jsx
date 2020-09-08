import React, { useState, useEffect, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";
import { Button, Comment } from "semantic-ui-react";
import ReactMarkdown from 'react-markdown';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import NotificationBadge, {Effect}  from 'react-notification-badge';
import RichTextEditor from "react-rte";

export const UserComment = ({ comment, onSubmitEditClick, onEditClick, discussionStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [reactionShown, setReactionShown ] = useState(false);
    const [selectedEmojis, setSelectedEmojis] = useState(comment.emojis ? [...comment.emojis] : []);

    let isAuthor = Meteor.userId() === comment.authorId;

    // // adding edit comment call - move to the UserComment.jsx
    const editComment = ({ _id }) => {
        let commentSpan = document.getElementById(_id + ":text");
        commentSpan.contentEditable = "true";
        let range = document.createRange();
        range.selectNodeContents(commentSpan);
        range.collapse(false);// supposed to set cursor to end of text but doesn't. todo
        commentSpan.focus();
    };

    //update comment call
    const updateComment = ({ _id }) => {
        let commentSpan = document.getElementById(_id + ":text");
        let text = RichTextEditor.createValueFromString(commentSpan.innerHTML, 'html').toString('markdown');
        commentSpan.contentEditable = "false";
        Meteor.call("comments.update", text, _id);
    };


    const handleShowEmojis = () => {
        setReactionShown(!reactionShown);
    }
    //handle emoji selection; take event, get previous emoji
    // ids and add emoji if not exists.
    // add to count for current selected id.
    // hide picker.
    const handleEmojiSelect = (selection) => {
        console.log("handling emoji")
        let emoOb = {emoji:selection, count:1};
        let existingEmojiIds = selectedEmojis.map(function(item) {
            return item.emoji.id;
        });
        if (!existingEmojiIds.includes(emoOb.emoji.id)){
            setSelectedEmojis([...selectedEmojis, emoOb]);
            // console.log(selectedEmojis);
            // const addNewEmoji = () => {
            //     Meteor.call("comments.updateEmojis", selectedEmojis, comment._id);
            // }
            // useEffect(addNewEmoji, selectedEmojis);
            Meteor.call("comments.updateEmojis", selectedEmojis, comment._id);
            setReactionShown(false);
            return;
             // todo. if this return isn't here then the emoji does not get added to the comment
            // in the browser. but also emojis only get added to db if there is more than one of the same type. weird.
        }

        selectedEmojis.forEach((emoObject) => {
        if (emoObject.emoji.id === emoOb.emoji.id){
            emoObject.count += 1;
        }})
        setSelectedEmojis([...selectedEmojis]);
        setReactionShown(false);
        console.log("updating comment in database with emojis")
        Meteor.call("comments.updateEmojis", selectedEmojis, comment._id);
        console.log("update complete")
    }

    const customReactionEmojis = [
        {
            id: '+1',
            name: '+1',
            short_names: ['+1'],
            text: '',
            emoticons: [],
            keywords: ['thumbsup'],
        },
        {
            id: 'clap',
            name: 'clap',
            short_names: ['clap'],
            // text: '',
            emoticons: [],
            keywords: ['clap'],
        },
        {
            id: '-1',
            name: '-1',
            short_names: ['-1'],
            // text: '',
            emoticons: [],
            keywords: ['thumbsdown'],
        },
        {
            id: 'heart',
            name: 'heart',
            short_names: ['heart'],
            // text: '',
            emoticons: [],
            keywords: ['heart'],
        }];

  // useTracker makes sure the component will re-render when the data changes.
    const { user } = useTracker(() => {
      Meteor.subscribe("users");

    return {
      user: Meteor.users.findOne({ _id: comment.authorId }),
    };
  });

  return (
    <Comment
      style={{
        margin: 20,
        backgroundColor: isAuthor ? "#EDE8FF" : "#F2F2F2",
        borderRadius: 5,
        border: "solid",
        borderWidth: 0.5,
        borderColor: isAuthor ? "#DFDBF0" : "#DFDBF0",
        padding: 5,
      }}
    >
      <Comment.Content>
        <Comment.Author as="a">{user && user.username}</Comment.Author>
        <Comment.Metadata>
          <div>{comment.postedTime.toDateString()}</div>
        </Comment.Metadata>
        <Comment.Text id={comment._id + ":text"} >
            <ReactMarkdown source={comment.text} />
        </Comment.Text>
      </Comment.Content>
        {isAuthor &&
        <Comment.Actions>
        <Button color='blue' content='Edit' size='mini' active={!isEditing} disabled={isEditing}
        onClick={() => {
            editComment(comment);
            setIsEditing(true);}} />
        <Button content='Save' size='mini' active={isEditing} disabled={!isEditing}
        onClick={() => {
            updateComment(comment);
            setIsEditing(false);
        }} />
        </Comment.Actions>
        }
        {discussionStatus === 'active' && <Button content='Add Reaction' size='mini' onClick={handleShowEmojis} />}
        {selectedEmojis &&
        selectedEmojis.map((emoji) => (
            <span style={{marginRight:17, margintop:107}}>
            <Emoji
                key={emoji.emoji.id}
                emoji={emoji.emoji} size={22}>
                <NotificationBadge
                key={emoji.emoji.id + ":count"}
                count={emoji.count}
                effect={[null, null, {top:'-3px'}, {top:'0px'}]}
                style={{color: 'black', backgroundColor:'yellow', top:'', left: '', bottom: '', right: '-16px', fontSize:'7px'}}/>
            </Emoji>
            </span>
        ))}
        {reactionShown &&
            <div className="reactions">
                <Picker
                    style={{width: 'auto'}}
                    showPreview={false}
                    showSkinTones={false}
                    include={['custom']}
                    custom={customReactionEmojis}
                    onSelect={handleEmojiSelect}
                />
            </div>
        }
    </Comment>

  );
};
