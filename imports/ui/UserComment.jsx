import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";
import { Button, Comment } from "semantic-ui-react";

export const UserComment = ({ comment, onSubmitEditClick, onEditClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  let classes = classnames("comment");
  let colour = "#F2F2F2";
  let borderCol = "#E5E5E5";

  if (Meteor.userId() === comment.authorId) {
    classes = classnames("comment usersComment");
    colour = "#EDE8FF";
    borderCol = "#DFDBF0";
  }

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
        backgroundColor: colour,
        borderRadius: 5,
        border: "solid",
        borderWidth: 0.5,
        borderColor: borderCol,
        padding: 5,
      }}
    >
      <Comment.Content>
        <Comment.Author as="a">{user && user.username}</Comment.Author>
        <Comment.Metadata>
          <div>{comment.postedTime.toDateString()}</div>
        </Comment.Metadata>
        <Comment.Text>{comment.text}</Comment.Text>
      </Comment.Content>
    </Comment>

    // <li className={classes} id={comment._id}>
    //   <span className="authorName">{user && user.username} - </span>
    //   <span className="commentTime">{comment.postedTime.toDateString()}</span>
    //   <br />
    //   <span id={comment._id + ":text"}>{comment.text}</span>
    //   <br />
    //   <span>
    //     {isEditing ? (
    //       <Button
    //         onClick={() => {
    //           onSubmitEditClick(comment);
    //           setIsEditing(false);
    //         }}
    //       >
    //         SAVE
    //       </Button>
    //     ) : (
    //       <Button
    //         onClick={() => {
    //           onEditClick(comment);
    //           setIsEditing(true);
    //         }}
    //       >
    //         EDIT
    //       </Button>
    //     )}
    //   </span>
    // </li>
  );
};
