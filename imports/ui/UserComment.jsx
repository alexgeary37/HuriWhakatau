import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";
import { Button, Comment } from "semantic-ui-react";
import ReactMarkdown from 'react-markdown';

export const UserComment = ({ comment, onSubmitEditClick, onEditClick }) => {
    const [isEditing, setIsEditing] = useState(false);
  // let classes = classnames("comment");
  // let colour = "#F2F2F2";
  // let borderCol = "#E5E5E5";
  let isAuthor = Meteor.userId() === comment.authorId;
  //if user is author then the page renders once for each comment in the discussion.
  // console.log(Meteor.userId());
  // if (isAuthor) {
    // classes = classnames("comment usersComment");
    // colour = "#EDE8FF";
    // borderCol = "#DFDBF0";
  // }

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
        {isAuthor ?
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
        </Comment.Actions> : <div></div>
        }
    </Comment>

  );
};