import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";

export const Comment = ({ comment, onDeleteClick }) => {
  let classes = classnames("comment");

  if (Meteor.userId() === comment.authorId) {
    classes = classnames("comment usersComment");
  }

  // useTracker makes sure the component will re-render when the data changes.
  const { users } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      users: Meteor.users.find().fetch(),
    };
  });

  const getUser = (authorId) => {
    console.log("users", users);
    const index = users.findIndex((x) => x._id === authorId);
  };

  return (
    <li className={classes}>
      <button onClick={() => onDeleteClick(comment)}>&times;</button>
      <span className="authorName">{getUser(comment.authorId)} - </span>
      <span className="commentTime">{comment.postedTime.toDateString()}</span>
      <br />
      <span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{comment.text}
      </span>
    </li>
  );
};
