import React from "react";
import classnames from "classnames";
import {Discussions} from "../api/discussions";

export const Comment = ({ comment, onDeleteClick, onSubmitEditClick, onEditClick }) => {
  let classes = classnames("comment");
  let user = Meteor.users.find(comment.authorId,{
      fields :{username : 1}});
  console.log(user);
  if (Meteor.userId() === comment.authorId) {
    classes = classnames("comment usersComment");
  }

  return (
    <li className={classes} id={comment._id}>
        <button onClick={() => onDeleteClick(comment)}>&times;</button>
        <button onClick={() => onEditClick(comment)}>EDIT</button>
        <button onClick={() => onSubmitEditClick(comment)}>SAVE</button>
        <span className="authorName">{comment.authorId} - </span>
      <span className="commentTime">{comment.postedTime.toDateString()}</span>
      <br />
      <span id={comment._id+":text"}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{comment.text}
      </span>
    </li>
  );
};
