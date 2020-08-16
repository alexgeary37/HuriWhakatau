import React, { useEffect, useRef } from "react";
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
      comments: Comments.find(filter, { sort: { postedTime: 1 } }).fetch(),
    };
  });

  const commentsEndRef = useRef(null)

  const scrollToBottom = () => {
    commentsEndRef.current.scrollIntoView({ behavior: "auto" })
  }

  useEffect(scrollToBottom, [comments]);

  return (
    <div className="juryroom">
      <h1>Discussion</h1>
      <div className="comments-and-form">
        <ul className="comments">
          {comments.map((comment) => (
            <div className="commentContainer" key={comment._id}>
              <Comment
                key={comment._id}
                comment={comment}
                onDeleteClick={deleteComment}
              />
            </div>
          ))}
          <div ref={commentsEndRef} />
        </ul>
        <CommentForm discussionId={discussionId} />
      </div>
    </div>
  );
};
