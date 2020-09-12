import React, { useState, useEffect, useRef } from "react";
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
  Menu,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Swipe from "react-easy-swipe";
import "../api/security";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useParams } from "react-router-dom";
import { Moment } from "react-moment";
import { Discussions } from "/imports/api/discussions";
import { Comments } from "/imports/api/comments";
import { Verdicts } from "/imports/api/verdicts";
import { NavBar } from "./NavBar";
import { UserComment } from "./UserComment";
import { CommentForm } from "./CommentForm";
import { Verdict } from "./Verdict";
import { VerdictForm } from "./VerdictForm";
import { VerdictDisplay } from "./VerdictDisplay";
import { Scenarios } from "/imports/api/scenarios";
import { Groups } from "../api/groups";

export const Discussion = () => {
  console.log("Entered discussion");
  const filter = {};
  const { discussionId } = useParams();
  const [deadline, setDeadline] = useState(new Date());

  const {
    scenario,
    group,
    discussionVerdictProposers,
    comments,
    verdicts,
    discussionStatus,
  } = useTracker(() => {
    const discussionSub = Meteor.subscribe("discussions", discussionId);
    const scenarioSub = Meteor.subscribe("scenarios");
    const groupSub = Meteor.subscribe("groups");
    Meteor.subscribe("comments", discussionId);
    Meteor.subscribe("verdicts", discussionId);
    Meteor.subscribe("roles");

    let verdictProposers;
    let discussionScenario;
    let discussionGroup;
    let discussionState;

    if (discussionSub.ready() && scenarioSub.ready() && groupSub.ready()) {
      let discussion = Discussions.findOne({});
      discussionScenario = Scenarios.findOne({ _id: discussion.scenarioId });
      discussionGroup = Groups.findOne({ _id: discussion.groupId });
      verdictProposers = discussion.activeVerdictProposers;
      discussionState = discussion.status;
    }

    return {
      scenario: discussionScenario,
      discussionVerdictProposers: verdictProposers,
      group: discussionGroup,
      comments: Comments.find(filter, { sort: { postedTime: 1 } }).fetch(),
      verdicts: Verdicts.find(filter, { sort: { postedTime: 1 } }).fetch(),
      discussionStatus: discussionState,
    };
  });

  //set reference for end of discussion and scroll to that point on page load
  // const commentsEndRef = useRef(null);
  // const scrollToBottom = () => {
  //   commentsEndRef.current.scrollIntoView({ behavior: "auto" });
  // };
  // useEffect(scrollToBottom, [comments]);

  // Return true if this user has submitted a verdict, false otherwise.
  const userHasSubmittedVerdict = () => {
    return verdicts.findIndex((x) => x.authorId === Meteor.userId()) !== -1;
  };

  const hasReachedConsensus = () => {
    for (i = 0; i < verdicts.length; i += 1) {
      const votes = verdicts[i].votes;
      if (
        votes.length === group.members.length - 1 &&
        votes.findIndex((x) => x.vote === false) === -1
      ) {
        return true;
      }
    }
    return false;
  };

  // const displayVerdict = () => <VerdictDisplay />;

  const proposeVerdict = () =>
    Meteor.call("discussions.addProposer", discussionId);

  return (
    <div>
      <NavBar />
      <div class="discussion-grid-container">
        <div class="grid-item">
          <Header content={scenario && scenario.title} size="medium" />
          {scenario && scenario.description}
        </div>
        <div class="grid-item-comments">
          {/* style={{ overflow: "auto", maxHeight: "80vh" }} */}
          <Comment.Group>
            {comments &&
              comments.map((comment) => (
                <UserComment
                  key={comment._id}
                  comment={comment}
                  discussionStatus={discussionStatus}
                />
              ))}{" "}
            {/* <div ref={commentsEndRef} /> */}
          </Comment.Group>
          {discussionStatus === "active" && (
            <CommentForm discussionId={discussionId} />
          )}
        </div>
        <div class="grid-item">
          <Container>
            <Header attached="top" content="Verdicts" size="medium" />
            <List style={{ overflow: "auto", maxHeight: "50em" }}>
              {verdicts &&
                verdicts.map((verdict) => (
                  <List.Item key={verdict._id}>
                    <Verdict
                      key={verdict._id}
                      verdict={verdict}
                      onVote={hasReachedConsensus}
                      // onClick={displayVerdict}
                    />
                  </List.Item>
                ))}
              {group && hasReachedConsensus() && (
                <Modal open={true}>
                  <Modal.Content>Consensus</Modal.Content>
                  <Modal.Actions>
                    <Button
                      as={Link}
                      to="/"
                      content="Return to Dashboard"
                    ></Button>
                  </Modal.Actions>
                </Modal>
              )}
              {!userHasSubmittedVerdict() &&
                discussionVerdictProposers &&
                (discussionVerdictProposers.includes(Meteor.userId()) ? (
                  <VerdictForm discussionId={discussionId} />
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
            </List>
          </Container>
        </div>
      </div>
    </div>
    // </Visibility>
    // <div>
    //   <NavBar />
    //   {/*hacky way to move content out from under menu*/}
    //   {/*<br/><br/>*/}
    //   <Container attached="bottom">
    //     <Grid columns={3} celled divided>
    //       <Grid.Row>
    //         <GridColumn width={3}>
    //           <Header content={scenario && scenario.title} size="medium" />
    //           {scenario && scenario.description}
    //           <Button
    //             content="Start countdown"
    //             onClick={() => {
    //               console.log(deadline);
    //               setDeadline(deadline.setMinutes(30));
    //               console.log(deadline);
    //             }}
    //           />
    //           {/* {deadline && (
    //             <Header floated="right" size="small">
    //               Discussion ends <Moment fromNow>{deadline}</Moment>
    //             </Header>
    //           )} */}
    //         </GridColumn>
    //         <GridColumn width={10}>
    //           <Comment.Group style={{ overflow: "auto", maxHeight: "80vh" }}>
    //             {comments &&
    //               comments.map((comment) => (
    //                 <UserComment
    //                   key={comment._id}
    //                   comment={comment}
    //                   discussionStatus={discussionStatus}
    //                 />
    //               ))}
    //             <div ref={commentsEndRef} />
    //           </Comment.Group>
    //           {discussionStatus === "active" && (
    //             <CommentForm discussionId={discussionId} />
    //           )}
    //         </GridColumn>
    //         <GridColumn width={3}>
    //           <Header content="Verdicts" size="medium" />
    //           <List style={{ overflow: "auto", maxHeight: "50em" }}>
    //             {verdicts &&
    //               verdicts.map((verdict) => (
    //                 <List.Item key={verdict._id}>
    //                   <Verdict
    //                     key={verdict._id}
    //                     verdict={verdict}
    //                     onVote={hasReachedConsensus}
    //                     // onClick={displayVerdict}
    //                   />
    //                 </List.Item>
    //               ))}
    //             {group && hasReachedConsensus() && (
    //               <Modal open={true}>
    //                 <Modal.Content>Consensus</Modal.Content>
    //                 <Modal.Actions>
    //                   <Button
    //                     as={Link}
    //                     to="/"
    //                     content="Return to Dashboard"
    //                   ></Button>
    //                 </Modal.Actions>
    //               </Modal>
    //             )}
    //             {!userHasSubmittedVerdict() &&
    //               discussionVerdictProposers &&
    //               (discussionVerdictProposers.includes(Meteor.userId()) ? (
    //                 <VerdictForm discussionId={discussionId} />
    //               ) : (
    //                 <div style={{ textAlign: "center" }}>
    //                   <Button
    //                     style={{ margin: 10 }}
    //                     content="Propose Verdict"
    //                     onClick={proposeVerdict}
    //                     primary
    //                   />
    //                 </div>
    //               ))}
    //           </List>
    //         </GridColumn>
    //       </Grid.Row>
    //     </Grid>
    //   </Container>
    // </div>
  );
};
