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
      <span>{comment.text}</span>
    </li>
  );
};
