import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Comments } from "/imports/api/comments";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";

// '_id' here is equal to 'comment' in Comment.jsx onDeleteClick(comment) I think ???
const deleteComment = ({ _id }) => Meteor.call("comments.remove", _id);

export const Discussion = ({ discussion }) => {
  const filter = {};

  const { comments } = useTracker(() => {
    Meteor.subscribe("comments");

    return {
      comments: Comments.find(filter, { sort: { postedTime: -1 } }).fetch(),
    };
  });

  return (
    <div className="juryroom">
      <h1>Discussion</h1>
      <div className="comments-and-form">
        <ul className="comments">
          {comments.reverse().map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDeleteClick={deleteComment}
            />
          ))}
        </ul>
        <CommentForm />
      </div>
    </div>
  );
};
