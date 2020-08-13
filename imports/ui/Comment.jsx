import React from "react";
import classnames from "classnames";

export const Comment = ({ comment, onDeleteClick }) => {
  const classes = classnames("comment");

  return (
    <li className={classes}>
      <button onClick={() => onDeleteClick(comment)}>&times;</button>
      <span>
        {comment.text} {comment.username && <i>({comment.username})</i>}
      </span>
    </li>
  );
};
