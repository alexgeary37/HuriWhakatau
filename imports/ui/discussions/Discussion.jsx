import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Header,
  Button,
  Comment,
  Modal,
  Grid,
  GridColumn,
  List,
  Divider,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "/imports/api/security";
import { useTracker } from "meteor/react-meteor-data";
import { Link, useParams, useHistory } from "react-router-dom";
import { Groups } from "/imports/api/groups";
import { Topics } from "/imports/api/topics";
import { Verdicts } from "/imports/api/verdicts";
import { Comments } from "/imports/api/comments";
import { Scenarios } from "/imports/api/scenarios";
import { Discussions } from "/imports/api/discussions";
import { DiscussionTemplates } from "/imports/api/discussionTemplates";
import { Verdict } from "/imports/ui/verdicts/Verdict";
import { CommentForm } from "/imports/ui/comments/CommentForm";
import { UserComment } from "/imports/ui/comments/UserComment";
import { VerdictForm } from "/imports/ui/verdicts/VerdictForm";
import { Timer } from "./Timer";
import { Layout } from "../navigation/Layout";

export const Discussion = () => {
  const { discussionId } = useParams();
  const [timedDiscussion, setTimedDiscussion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isOpenConsensusModal, setIsOpenConsensusModal] = useState(true);
  const [userInGroup, setUserInGroup] = useState(false);
  const [commentsHook, setCommentsHook] = useState([]);
  const [scrollToBottomMessage, setScrollToBottomMessage] = useState(false);
  let history = useHistory();
  // use to allow comments or proposing / voting on verdicts
  // todo, if the user uses the browser back button to go back to dash from a timed discussion
  // and then to a non-timed discussion the timedDiscussion state stays true

  // used timer code from https://www.digitalocean.com/community/tutorials/react-countdown-timer-react-hooks
  const calculateTimeLeft = () => {
    let current = new Date();
    let days = Math.floor(
      ((discussionDeadline - current) % (1000 * 60 * 60 * 24 * 365)) /
        (1000 * 60 * 60 * 24)
    );
    let hours = Math.floor(
      ((discussionDeadline - current) % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );
    let minutes = Math.floor(
      ((discussionDeadline - current) % (1000 * 60 * 60)) / (1000 * 60)
    );
    let seconds = Math.floor(
      ((discussionDeadline - current) % (1000 * 60)) / 1000
    );
    return (
      (days ? days.toString().padStart(2, "0") + ":" : "") +
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  };

  // If discussion is timed then trigger calc of time left and update ui every 1 second.
  useEffect(() => {
    if (timedDiscussion) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      // Clear timeout if the component is unmounted.
      return () => clearTimeout(timer);
    }
  });

  const {
    scenario,
    group,
    topic,
    discussionVerdictProposers,
    comments,
    verdicts,
    discussionStatus,
    discussionTemplate,
    discussionDeadline,
    discussionTimeLimit,
    discussionConsensusThreshold,
    nextDiscussionId,
    discussionIsPublic,
  } = useTracker(() => {
    const discussionSub = Meteor.subscribe("discussions", discussionId);
    const scenarioSub = Meteor.subscribe("scenarios");
    const groupSub = Meteor.subscribe("groups");
    const topicSub = Meteor.subscribe("topics");
    const discussionTemplateSub = Meteor.subscribe("discussionTemplates");
    const commentsSub = Meteor.subscribe("comments", discussionId);
    Meteor.subscribe("verdicts", discussionId);
    Meteor.subscribe("roles");

    let verdictProposers;
    let discussionScenario;
    let discussionGroup;
    let discussionState;
    let timeLimit;
    let consensusThreshold;
    let discussionDeadline;
    let discussionTopic;
    let discussionTemplate;
    let nextDiscussionId;
    let publicDiscussion;
    let comments;
    if (
      discussionSub.ready() &&
      scenarioSub.ready() &&
      groupSub.ready() &&
      topicSub.ready() &&
      discussionTemplateSub.ready() &&
      commentsSub.ready()
    ) {
      let discussion = Discussions.findOne({ _id: discussionId });
      discussionScenario = Scenarios.findOne({ _id: discussion.scenarioId });
      discussionGroup = Groups.findOne({ _id: discussion.groupId });
      verdictProposers = discussion.activeVerdictProposers;
      discussionState = discussion.status;
      discussionTemplate = DiscussionTemplates.findOne({
        _id: discussionScenario.discussionTemplateId,
      });
      timeLimit = discussion.timeLimit ? discussion.timeLimit : 0;
      consensusThreshold = discussion.consensusThreshold
        ? discussion.consensusThreshold
        : 0;
      discussionDeadline = discussion.deadline ? discussion.deadline : null;
      publicDiscussion = discussion.isPublic ? discussion.isPublic : false;
      discussionTopic = Topics.findOne({ _id: discussionScenario.topicId });
      nextDiscussionId = discussion.nextDiscussion
        ? discussion.nextDiscussion
        : null;
      comments = Comments.find(
        { discussionId: discussionId },
        { sort: { postedTime: 1 } }
      ).fetch()
    }

    return {
      scenario: discussionScenario,
      discussionVerdictProposers: verdictProposers,
      group: discussionGroup,
      topic: discussionTopic,
      comments: comments,
      verdicts: Verdicts.find(
        { discussionId: discussionId },
        { sort: { postedTime: 1 } }
      ).fetch(),
      discussionStatus: discussionState,
      discussionTemplate: discussionTemplate,
      discussionTimeLimit: timeLimit,
      discussionConsensusThreshold: consensusThreshold,
      discussionDeadline: discussionDeadline,
      discussionIsPublic: publicDiscussion,
      nextDiscussionId: nextDiscussionId,
    };
  });

  //check if user is in the discussion group
  const checkGroupMembership = () => {
    if (group && group.members.includes(Meteor.userId())) {
      setUserInGroup(true);
    }
  };

  useEffect(() => {
    checkGroupMembership();
    document.title = "Discussion - " + (scenario && scenario.title);
  }, [group]);

  // IF discussion deadline is null, update discussion deadline with current date + discussion timelimit.
  if (discussionDeadline == null && discussionTimeLimit > 0) {
    const currentDateTime = new Date();
    Meteor.call(
      "discussions.updateDeadline",
      discussionId,
      new Date(currentDateTime.getTime() + discussionTimeLimit * 60000)
    );
  }

  if (discussionDeadline !== null) {
    let currentTime = new Date();
    if (
      discussionDeadline > currentTime &&
      discussionStatus === "active" &&
      !timedDiscussion
    ) {
      // Discussion has time left and is active, but is not timed.
      setTimedDiscussion(true); // If page is refreshed this needs to be set back to true.
    } else if (
      discussionDeadline < currentTime &&
      discussionStatus === "active" &&
      timedDiscussion
    ) {
      // Deadline has passed, but discussion is still active and timed.
      setTimedDiscussion(false);
      Meteor.call("discussions.updateStatus", discussionId, "timedout");
      Meteor.call("discussions.updateDeadlineTimeout", discussionId);
    }
  }

  // Update the commentshook whenever the comments in the database are changed.
  useEffect(() => {
    setCommentsHook(comments);
  }, [comments && comments.length]);

  // Set reference for end of discussion and scroll to that point every 
  // time a comment is posted in the discussion.
  const commentsEndRef = useRef(null);

  // Scroll to bottom of comments every time this user makes a comment.
  useEffect(() => {
    commentsEndRef.current.scrollIntoView({ behavior: 'auto'});
  }, [commentsHook && commentsHook.filter((comment) => comment.authorId === Meteor.userId()).length]);

  // Return whether the user has scrolled up from the bottom of the comments or not.
  // https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
  const isInViewport = (offset = 0) => {
    if (commentsEndRef.current) {
      const top = commentsEndRef.current.getBoundingClientRect().top;
      return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
    }
    return false;
  }

  // Scroll to bottom of comments every time other users make comments, unless
  // this user has scrolled up to view other comments.
  useEffect(() => {
    if (isInViewport()) {
      commentsEndRef.current.scrollIntoView({ behavior: "auto" });
    } else {
      setScrollToBottomMessage(true);
    }
  }, [
    commentsHook && commentsHook.length,
  ]);

  // Return true if this user has submitted a verdict, false otherwise.
  const userHasSubmittedVerdict = () => {
    return verdicts.findIndex((x) => x.authorId === Meteor.userId()) !== -1;
  };

  // Return true if the discussion has reached consensus, false otherwise.
  const hasReachedConsensus = () => {
    for (i = 0; i < verdicts.length; i += 1) {
      const votes = verdicts[i].votes;
      if (
        votes.filter((vote) => vote.vote !== false).length ===
        discussionConsensusThreshold
      ) {
        Meteor.call("discussions.updateStatus", discussionId, "finished");
        return verdicts[i];
      }
    }
    return false;
  };

  // Add this user as a current verdict proposer in this discussion.
  const proposeVerdict = () =>
    Meteor.call("discussions.addProposer", discussionId);

  // Go to the next discussion.
  const nextDiscussion = () => {
    history.push("/discussion/" + nextDiscussionId);
  };

  const discussionPageContent = () => {
    return (
      // <Container style={{backgroundColor: 'pink'}}>
      <Container>
        <Grid columns={3}>
          {" "}
          <GridColumn width={3} style={{ height: "90vh" }}>
            <Header
              inverted
              content={(scenario && scenario.title) || (topic && topic.title)}
              size="medium"
            />
            <Divider />
            {/* replace the topic with scenario only once old data is cleared out */}
            <Header
              as={"h5"}
              inverted
              content={
                (scenario && scenario.description) ||
                (topic && topic.description)
              }
            />
            {timedDiscussion && discussionStatus === "active" && (
              <Timer time={timeLeft} />
            )}
          </GridColumn>
          <GridColumn width={10} textAlign="left">
            <div style={{ position: "absolute", bottom: "0px", width: "95%" }}>
              <Comment.Group style={{ overflow: "auto", maxHeight: "70vh" }}>
                {commentsHook &&
                  commentsHook.map((comment) => (
                    <UserComment
                      key={comment._id}
                      comment={comment}
                      discussionStatus={discussionStatus}
                      userCanEdit={
                        discussionTemplate
                          ? discussionTemplate.usersCanEditComments
                          : true
                      }
                      userInGroup={userInGroup}
                    />
                  ))}
                <div ref={commentsEndRef} />
              </Comment.Group>
              {discussionStatus === "active" && userInGroup && (
                <CommentForm
                  discussionId={discussionId}
                  showTypingNotification={
                    discussionTemplate.showTypingNotification
                  }
                  isDiscussionPublic={discussionIsPublic}
                  isUserAGroupMember={userInGroup}
                  groupId={group._id}
                  displayScrollToBottomMessage={scrollToBottomMessage}
                  toggleScrollToBottomMessage={() => {
                    // Scroll to bottom of comments.
                    setScrollToBottomMessage(false)
                    commentsEndRef.current.scrollIntoView({ behavior: "auto" })
                  }}
                />
              )}
            </div>
          </GridColumn>
          <GridColumn width={3}>
            <Header inverted content="Verdicts" size="medium" />
            <Divider />
            <List style={{ overflow: "auto", maxHeight: "50em" }}>
              {verdicts &&
                verdicts.map((verdict) => (
                  <List.Item key={verdict._id}>
                    <Verdict
                      key={verdict._id}
                      verdict={verdict}
                      onVote={hasReachedConsensus}
                      discussionStatus={discussionStatus}
                      discussionIsPublic={discussionIsPublic}
                      userInGroup={userInGroup}
                    />
                  </List.Item>
                ))}
              {group && hasReachedConsensus() && (
                <Modal open={isOpenConsensusModal}>
                  <Modal.Content>
                    Discussion reached a consensus:
                    {<Verdict verdict={hasReachedConsensus()} />}
                  </Modal.Content>
                  <Modal.Actions>
                    {nextDiscussionId && (
                      <Button
                        as={Link}
                        to={"/discussion/" + nextDiscussionId}
                        content={"Next discussion"}
                      />
                    )}
                    <Button
                      as={Link}
                      to="/mydashboard"
                      content="Return to Dashboard"
                    />
                    <Button
                      content="View Discussion"
                      onClick={() => setIsOpenConsensusModal(false)}
                    />
                  </Modal.Actions>
                </Modal>
              )}
              {!userHasSubmittedVerdict() &&
                discussionVerdictProposers &&
                userInGroup &&
                discussionStatus === "active" &&
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
              {discussionStatus !== "active" &&
                nextDiscussionId &&
                nextDiscussionId.length > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <Button
                      style={{ margin: 10 }}
                      content={"Go to next"}
                      onClick={nextDiscussion}
                      primary
                    />
                  </div>
                )}
            </List>
          </GridColumn>
        </Grid>
      </Container>
    );
  };

  return <Layout page={discussionPageContent} isDiscussion={true} />;
};
