import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Comment } from "./Comment";
import { Comments } from "/imports/api/comments";
import { CommentForm } from "./CommentForm";
import { LoginForm } from "./LoginForm";

const deleteComment = ({ _id }) => Meteor.call("comments.remove", _id);

export const App = () => {
  const filter = {};

  const { comments, user } = useTracker(() => {
    Meteor.subscribe("comments");

    return {
      comments: Comments.find(filter, { sort: { createdAt: -1 } }).fetch(),
      user: Meteor.user(),
    };
  });

  if (!user) {
    return (
      <div className="juryroom">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="juryroom">
      <h1>JuryRoom</h1>

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
