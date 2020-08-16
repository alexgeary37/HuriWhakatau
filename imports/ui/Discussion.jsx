import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Comments } from "/imports/api/comments";
import { Discussions } from "/imports/api/discussions";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { useParams } from "react-router-dom";

// '_id' here is equal to 'comment' in Comment.jsx onDeleteClick(comment) I think ???
const deleteComment = ({ _id }) => Meteor.call("comments.remove", _id);

export const Discussion = () => {
  const filter = {};
  const { discussionId } = useParams();

  const { comments, discussion } = useTracker(() => {
    Meteor.subscribe("comments", discussionId);
    Meteor.subscribe("discussions");

    // Tying to use {discussion.title} in h1 header, but is saying it can't find it.
    // Perhaps it's something to do with mounting???
    const disc = Discussions.findOne({ _id: discussionId });
    console.log(disc);
    // console.log(disc.title);

    return {
      discussion: Discussions.findOne({ _id: discussionId }),
      comments: Comments.find(filter, { sort: { postedTime: -1 } }).fetch(),
    };
  });

  return (
    <div className="juryroom">
      <h1>Discussion</h1>
      <div className="verdicts">
        {/* <ul className="verdicts">

        </ul> */}
        <button>Propose Verdict</button>
      </div>
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
