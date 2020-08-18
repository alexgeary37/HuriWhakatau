import React from "react";
import classnames from "classnames";

export const Comment = ({ comment, onDeleteClick }) => {
  let classes = classnames("comment");

  if (Meteor.userId() === comment.authorId) {
    classes = classnames("comment usersComment");
  }

  return (
    <li className={classes}>
      <button onClick={() => onDeleteClick(comment)}>&times;</button>
        <span className="authorName">{comment.authorId} - </span>
        <span className="commentTime">{comment.postedTime.toDateString()}</span>
        <br/>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{comment.text}</span>
    </li>
  );
};
