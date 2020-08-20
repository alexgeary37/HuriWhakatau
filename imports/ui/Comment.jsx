import React from "react";
import classnames from "classnames";
import { Discussions } from "../api/discussions";

export const Comment = ({ comment, onDeleteClick }) => {
  let classes = classnames("comment");
  let user = Meteor.users.find(comment.authorId, {
    fields: { username: 1 },
  });
  console.log(user);

  if (Meteor.userId() === comment.authorId) {
    classes = classnames("comment usersComment");
  }

  return (
    <li className={classes}>
      <button onClick={() => onDeleteClick(comment)}>&times;</button>
      <span className="authorName">{comment.authorId} - </span>
      <span className="commentTime">{comment.postedTime.toDateString()}</span>
      <br />
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{comment.text}
      </span>
    </li>
  );
};
