import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";
import { Button, Comment } from "semantic-ui-react";
import ReactMarkdown from 'react-markdown';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import NotificationBadge, {Effect}  from 'react-notification-badge';

export const UserComment = ({ comment, onSubmitEditClick, onEditClick, discussionStatus }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [reactionShown, setReactionShown ] = useState(false);
    const [selectedEmojis, setSelectedEmojis] = useState(comment.emojis ? [...comment.emojis] : []);

    let isAuthor = Meteor.userId() === comment.authorId;

    const handleShowEmojis = () => {
        setReactionShown(!reactionShown);
    }

    //handle emoji selection; take event, get previous emoji ids and
    // add to count for current selected id. Add emoji if not exists.
    // hide picker.
    const handleEmojiSelect = (selection) => {
        let emoOb = {emoji:selection, count:1};
        let justEmojis = selectedEmojis.map(function(item) {
            return item.emoji.id;
        });
        if (!justEmojis.includes(emoOb.emoji.id)){
            setSelectedEmojis([...selectedEmojis, emoOb]);
            setReactionShown(false);
            return;
        }
        selectedEmojis.forEach((emoObject) => {
        if (emoObject.emoji.id === emoOb.emoji.id){
            emoObject.count += 1;
        }})
        setSelectedEmojis([...selectedEmojis]);
        setReactionShown(false);
        Meteor.call("comments.updateEmojis", selectedEmojis, comment._id);
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
            text: '',
            emoticons: [],
            keywords: ['clap'],
        },
        {
            id: '-1',
            name: '-1',
            short_names: ['-1'],
            text: '',
            emoticons: [],
            keywords: ['thumbsdown'],
        },
        {
            id: 'heart',
            name: 'heart',
            short_names: ['heart'],
            text: '',
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
            onEditClick(comment);
            setIsEditing(true);}} />
        <Button content='Save' size='mini' active={isEditing} disabled={!isEditing}
        onClick={() => {
            onSubmitEditClick(comment);
            setIsEditing(false);
        }} />
        </Comment.Actions>
        }
        {discussionStatus === 'active' && <Button content='Add Reaction' size='mini' onClick={handleShowEmojis} />}
        {selectedEmojis &&
        selectedEmojis.map((emoji) => (
            <span style={{marginRight:17, margintop:107}}>
            <Emoji
                emoji={emoji.emoji} size={22}>
                <NotificationBadge
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
