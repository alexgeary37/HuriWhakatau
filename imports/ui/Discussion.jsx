import React, { useEffect, useRef, useState } from "react";
import {Sidebar, Container, Segment, Header, Button, Visibility, Grid, GridColumn} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { Discussions } from "/imports/api/discussions";
import { Comments } from "/imports/api/comments";
import { Verdicts } from "/imports/api/verdicts";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { Verdict } from "./Verdict";
import { VerdictForm } from "./VerdictForm";

export const Discussion = () => {
  const filter = {};
  const { discussionId } = useParams();

  // '_id' here is equal to 'comment' in Comment.jsx onDeleteClick(comment) I think ???
  const deleteComment = ({ _id }) => Meteor.call("comments.remove", _id);

  const {
    // Constants to return and use for component rendering
    discussionTitle,
    discussionDescription,
    discussionVerdictProposers,
    comments,
    verdicts,
  } = useTracker(() => {
    // useTracker makes sure the component will re-render when the data changes.
    Meteor.subscribe("comments", discussionId);
    Meteor.subscribe("verdicts", discussionId);
    let discSub = Meteor.subscribe("discussions");
    let _discSubReady = discSub.ready();

    let thisDiscussionTitle = "";
    let thisDiscussionDescription = "";
    let verdictProposers = [];
    if (_discSubReady) {
      // Get the data for the constants.
      let discussion = Discussions.findOne({ _id: discussionId });
      thisDiscussionTitle = discussion.title;
      thisDiscussionDescription = discussion.description;
      verdictProposers = discussion.activeVerdictProposers;
    }

    return {
      // Assign and return the constants initialized with data.
      discussionTitle: thisDiscussionTitle,
      discussionDescription: thisDiscussionDescription,
      discussionVerdictProposers: verdictProposers,
      comments: Comments.find(filter, { sort: { postedTime: 1 } }).fetch(),
      verdicts: Verdicts.find(filter, { sort: { postedTime: 1 } }).fetch(),
    };
  });

  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(scrollToBottom, [comments]);

  const renderVerdictForm = discussionVerdictProposers.includes(
    Meteor.userId()
  ) ? (
    <VerdictForm discussionId={discussionId} />
  ) : (
    <button
      onClick={() => Meteor.call("discussions.addProposer", discussionId)}
    >
      Propose Verdict
    </button>
  );

  return (
    <div className="juryroom">
      <Header as='h2' attached='top'>
        {discussionTitle}
      </Header>
      <Header as='h5' attached='true'>
        {discussionDescription}
      </Header>
      <Segment.Group horizontal>
      <Segment className="discussion-right-panel">
        {verdicts.map((verdict) => (
          <div className="verdictContainer" key={verdict._id}>
            <Verdict key={verdict._id} verdict={verdict} />
          </div>
        ))}
        {renderVerdictForm}
      </Segment>

      <Segment className="comments-and-form">
        <ul className="comments" style={{overflow: 'auto', maxHeight: '50em' }}>
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
      </Segment>
        <Segment>RIGHT Content</Segment>
      </Segment.Group>
    </div>
  );
};
