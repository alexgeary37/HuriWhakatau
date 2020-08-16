import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Comments } from "/imports/api/comments";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { useParams } from "react-router-dom";

// '_id' here is equal to 'comment' in Comment.jsx onDeleteClick(comment) I think ???
const deleteComment = ({ _id }) => Meteor.call("comments.remove", _id);

export const Discussion = () => {
  const filter = {};
  const { discussionId } = useParams();

  const { comments } = useTracker(() => {
    Meteor.subscribe("comments", discussionId);

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
            <div className="commentContainer" key={comment._id}>
              <Comment
                key={comment._id}
                comment={comment}
                onDeleteClick={deleteComment}
              />
            </div>
          ))}
        </ul>
        <CommentForm discussionId={discussionId} />
      </div>
    </div>
  );
};
