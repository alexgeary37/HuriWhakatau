import React, { useEffect, useRef } from "react";
import {
  Sidebar,
  Container,
  Segment,
  Header,
  Button,
  Visibility,
  Comment,
  Modal,
  Input,
  Label,
  Grid,
  GridColumn,
  List,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { Discussions } from "/imports/api/discussions";
import { Comments } from "/imports/api/comments";
import { Verdicts } from "/imports/api/verdicts";
import { NavBar } from "./NavBar";
import { UserComment } from "./UserComment";
import { CommentForm } from "./CommentForm";
import { Verdict } from "./Verdict";
import { VerdictForm } from "./VerdictForm";
import { Scenarios } from "/imports/api/scenarios";

export const Discussion = () => {
  const filter = {};
  const { discussionId } = useParams();

  const {
    scenario,
    discussionVerdictProposers,
    comments,
    verdicts,
  } = useTracker(() => {
    const discussionSub = Meteor.subscribe("discussions", discussionId);
    const scenarioSub = Meteor.subscribe("scenarios");
    Meteor.subscribe("comments", discussionId);
    Meteor.subscribe("verdicts", discussionId);

    let verdictProposers;
    let discussionScenario;

    if (discussionSub.ready() && scenarioSub.ready()) {
      let discussion = Discussions.findOne({});
      discussionScenario = Scenarios.findOne({ _id: discussion.scenarioId });
      verdictProposers = discussion.activeVerdictProposers;
    }

    return {
      scenario: discussionScenario,
      discussionVerdictProposers: verdictProposers,
      comments: Comments.find(filter, { sort: { postedTime: 1 } }).fetch(),
      verdicts: Verdicts.find(filter, { sort: { postedTime: 1 } }).fetch(),
    };
  });

  // // adding edit comment call
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
    <div>
      <NavBar />
      <Container
      // className="juryroom"
      >
        <Grid columns={3} celled divided>
          <Grid.Row>
            <GridColumn width={3}>
              <Header content={scenario && scenario.title} size="large" />
              {scenario && scenario.description}
            </GridColumn>
            <GridColumn
              // className="comments-and-form"
              width={10}
            >
              {/* <List
              // className="comments"
              style={{ overflow: "auto", maxHeight: "50em" }}
            > */}
              <Comment.Group>
                {comments &&
                  comments.map((comment) => (
                    // <List.Item
                    //   // className="commentContainer"
                    //   key={comment._id}
                    // >
                    <UserComment
                      key={comment._id}
                      comment={comment}
                      onEditClick={editComment}
                      onSubmitEditClick={updateComment}
                    />
                    // </List.Item>
                  ))}
                <div ref={commentsEndRef} />
              </Comment.Group>
              {/* </List> */}
              <CommentForm discussionId={discussionId} />
            </GridColumn>
            <GridColumn
              // className="discussion-right-panel"
              width={3}
            >
              <Header content="Verdicts" size="large" />
              <List
                // className="verdicts"
                style={{ overflow: "auto", maxHeight: "50em" }}
              >
                {verdicts &&
                  verdicts.map((verdict) => (
                    <List.Item
                      // className="verdictContainer"
                      key={verdict._id}
                    >
                      <Verdict key={verdict._id} verdict={verdict} />
                    </List.Item>
                  ))}
                {!userHasSubmittedVerdict() &&
                  discussionVerdictProposers &&
                  (discussionVerdictProposers.includes(Meteor.userId()) ? (
                    <VerdictForm
                      discussionId={discussionId}
                      isProposing={discussionVerdictProposers.includes(
                        Meteor.userId()
                      )}
                    />
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <Button
                        style={{ margin: 10 }}
                        content="Propose Verdict"
                        onClick={proposeVerdict}
                        primary
                      />
                    </div>
                  ))}
                {discussion}
              </List>
            </GridColumn>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};
