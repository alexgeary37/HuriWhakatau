import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Comment } from "./Comment";
import { Comments } from "/imports/api/comments";
import { CommentForm } from "./CommentForm";
import { LoginForm } from "./LoginForm";
import { Sidebar, Segment } from "semantic-ui-react";

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
    <div>
      {/* 
      
      This is attempting to use the semantic-ui-react library to emulate original JuryRoom.

      <Sidebar animation="overlay" direction="right">
        <h1>Verdicts</h1>
        <button>Propose Verdict</button>
      </Sidebar>
      <Sidebar animation="overlay" direction="left">
        <h1>Title Section</h1>
        <button>Button to look at</button>
      </Sidebar> */}
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
    </div>
  );
};
