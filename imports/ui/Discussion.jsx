import React, { useEffect, useRef } from "react";
import {
  Sidebar,
  Container,
  Segment,
  Header,
  Button,
  Visibility,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useTracker } from "meteor/react-meteor-data";
import { useParams, withRouter } from "react-router-dom";
import { Discussions } from "/imports/api/discussions";
import { Comments } from "/imports/api/comments";
import { Verdicts } from "/imports/api/verdicts";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { Verdict } from "./Verdict";
import { VerdictForm } from "./VerdictForm";
import { Scenarios } from "/imports/api/scenarios";

export const Discussion = () => {
  const filter = {};
  const { discussionId } = useParams();

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

    let thisDiscussionTitle = "";
    let thisDiscussionDescription = "";
    let verdictProposers = [];
    if (discSub.ready()) {
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

  // '_id' here is equal to 'comment' in Comment.jsx onDeleteClick(comment) I think ???
  const deleteComment = ({ _id }) => Meteor.call("comments.remove", _id);
  // adding edit comment call
  const editComment = ({ _id }) => {
    let commentSpan = document.getElementById(_id + ":text");
    commentSpan.contentEditable = "true";
    let range = document.createRange();
    range.selectNodeContents(commentSpan);
    range.collapse("false");
    commentSpan.focus();
    Meteor.call("comments.edit", _id);
  };
  //update comment call
  const updateComment = ({ _id }) => {
    let commentSpan = document.getElementById(_id + ":text");
    let text = commentSpan.innerText;
    console.log(text);
    commentSpan.contentEditable = "false";
    Meteor.call("comments.update", text, _id);
  };

  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(scrollToBottom, [comments]);

  // Return true if this user has submitted a verdict, false otherwise.
  const userHasSubmittedVerdict = () => {
    return verdicts.findIndex((x) => x.authorId === Meteor.userId()) !== -1;
  };

  const proposeVerdict = () =>
    Meteor.call("discussions.addProposer", discussionId);

  return (
    <div className="juryroom">
      <Header as="h2">{discussionTitle}</Header>
      <Header as="h5" attached>
        {discussionDescription}
      </Header>
      <Segment.Group horizontal>
        <Segment className="discussion-right-panel">
          {verdicts.map((verdict) => (
            <div className="verdictContainer" key={verdict._id}>
              <Verdict key={verdict._id} verdict={verdict} />
            </div>
          ))}
          {!userHasSubmittedVerdict() &&
            (discussionVerdictProposers.includes(Meteor.userId()) ? (
              <VerdictForm discussionId={discussionId} />
            ) : (
              <button onClick={proposeVerdict}>Propose Verdict</button>
            ))}
        </Segment>

        <Segment className="comments-and-form">
          <ul
            className="comments"
            style={{ overflow: "auto", maxHeight: "50em" }}
          >
            {comments.map((comment) => (
              <div className="commentContainer" key={comment._id}>
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDeleteClick={deleteComment}
                  onEditClick={editComment}
                  onSubmitEditClick={updateComment}
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
