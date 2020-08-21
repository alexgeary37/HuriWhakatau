import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";

export const Comment = ({
  comment,
  onDeleteClick,
  onSubmitEditClick,
  onEditClick,
}) => {
  let classes = classnames("comment");

  if (Meteor.userId() === comment.authorId) {
    classes = classnames("comment usersComment");
  }

  // useTracker makes sure the component will re-render when the data changes.
  const { user } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      user: Meteor.users.findOne({ _id: comment.authorId }),
    };
  });

  return (
    <li className={classes} id={comment._id}>
      <button onClick={() => onDeleteClick(comment)}>&times;</button>
      <button onClick={() => onEditClick(comment)}>EDIT</button>
      <button onClick={() => onSubmitEditClick(comment)}>SAVE</button>
      <span className="authorName">{user && user.username} - </span>
      <span className="commentTime">{comment.postedTime.toDateString()}</span>
      <br />
      <span id={comment._id + ":text"}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{comment.text}
      </span>
    </li>
  );
};
