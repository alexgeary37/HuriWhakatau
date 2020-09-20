import React, {useEffect, useRef, useState} from "react";
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
import "/imports/api/security";
import {useTracker} from "meteor/react-meteor-data";
import {Link, useParams} from "react-router-dom";
import {Discussions} from "/imports/api/discussions";
import {Comments} from "/imports/api/comments";
import {Verdicts} from "/imports/api/verdicts";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {UserComment} from "/imports/ui/comments/UserComment";
import {Timer} from "./Timer";
import {CommentForm} from "/imports/ui/comments/CommentForm";
import {Verdict} from "/imports/ui/verdicts/Verdict";
import {VerdictForm} from "/imports/ui/verdicts/VerdictForm";
import {Scenarios} from "/imports/api/scenarios";
import {Groups} from "/imports/api/groups";
import {Topics} from "/imports/api/topics";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {UserSummary} from "../users/UserSummary";

//adaption of the Discussion.jsx to bring it in line with Tamahau's designs
export const HuiChat = () => {
    console.log("Entered hui");
    const filter = {};
    const {discussionId} = useParams();
    const [userVotedForLeader, setUserVotedForLeader] = useState(false);
    const [isDiscussion, setIsDiscussion] = useState(false); //display differently if a discussion vs
    // introduction eg show/hide verdict proposal etc
    const [timedDiscussion, setTimedDiscussion] = useState(false);
    const [mutableDiscussionDeadline, setMutableDiscussionDeadline] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [userInGroup, setUserInGroup] = useState(false); //set if user is in the discussion group and
    // use to allow comments or proposing / voting on verdicts
    //todo, if the user uses the browser back button to go back to dash from a timed discussion
    // and then to a non-timed discussion the timedDiscussion state stays true
    const updateTimed = () => {
        setTimedDiscussion(true);
    }
    const updateDeadline = (deadline) => {
        setMutableDiscussionDeadline(deadline);
        console.log("deadline updated", mutableDiscussionDeadline);
    }

    //used timer code from https://www.digitalocean.com/community/tutorials/react-countdown-timer-react-hooks
    // user for discussions but not introductions, introductions should be finished by the group leader
    const calculateTimeLeft = () => {
        let current = new Date();
        let hours = Math.floor(((discussionDeadline - current) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor(((discussionDeadline - current) % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor(((discussionDeadline - current) % (1000 * 60)) / 1000);
        console.log("timeleft: ", minutes);
        return hours.toString().padStart(2, '0')
            + ":" +
            minutes.toString().padStart(2, '0')
            + ":" +
            seconds.toString().padStart(2, '0');
    }
    // if timed then trigger calc of time left and update ui every 1 second
    useEffect(() => {
        if (timedDiscussion) {
            const timer = setTimeout(() => {
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            // Clear timeout if the component is unmounted
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
        groupMembers,
        groupLeader,
    } = useTracker(() => {
        const discussionSub = Meteor.subscribe("discussions", discussionId);
        const scenarioSub = Meteor.subscribe("scenarios");
        const groupSub = Meteor.subscribe("groups");
        const topicSub = Meteor.subscribe("topics");
        const discussionTemplateSub = Meteor.subscribe("discussionTemplates");
        Meteor.subscribe("comments", discussionId);
        Meteor.subscribe("verdicts", discussionId);
        Meteor.subscribe("roles");
        Meteor.subscribe("users");

        let verdictProposers;
        let discussionScenario;
        let discussionGroup;
        let discussionState;
        let discussionTimeLimit;
        let discussionDeadline;
        let discussionTopic;
        let discussionTemplate;
        let groupMembers = [];
        let theGroupLeader;
        if (
            discussionSub.ready() &&
            scenarioSub.ready() &&
            groupSub.ready() &&
            topicSub.ready() &&
            discussionTemplateSub.ready()
        ) {
            let discussion = Discussions.findOne({});
            discussionScenario = Scenarios.findOne({_id: discussion.scenarioId});
            discussionGroup = Groups.findOne({_id: discussion.groupId});
            verdictProposers = discussion.activeVerdictProposers;
            discussionState = discussion.status;
            discussionTemplate = DiscussionTemplates.findOne({
                _id: discussionScenario.discussionTemplateId,
            });
            discussionTimeLimit = discussionTemplate
                ? discussionTemplate.timeLimit
                : 0;
            discussionDeadline = discussion.deadline ? discussion.deadline : null;
            discussionTopic = Topics.findOne({_id: discussionScenario.topicId});

            groupMembers = Meteor.users.find({_id: {$in: discussionGroup.members}})
            theGroupLeader = discussionGroup.groupLeader;
            //get group members an usernames for showing in the participants panel
            //   discussionGroup.members.forEach((member) => {
            //       // let user =
            //       groupMembers.push(Meteor.users.findOne({_id: member}).username);
            //   })
        }

        return {
            scenario: discussionScenario,
            discussionVerdictProposers: verdictProposers,
            group: discussionGroup,
            topic: discussionTopic,
            comments: Comments.find(filter, {sort: {postedTime: 1}}).fetch(),
            verdicts: Verdicts.find(filter, {sort: {postedTime: 1}}).fetch(),
            discussionStatus: discussionState,
            discussionTemplate: discussionTemplate,
            discussionTimeLimit: discussionTimeLimit,
            discussionDeadline: discussionDeadline,
            groupMembers: groupMembers,
            groupLeader: theGroupLeader,
        };
    });
    // debug msg
    console.log(
        "time limit: ",
        discussionTimeLimit,
        "\ndiscussion deadline: ",
        discussionDeadline,
        "timed: ",
        timedDiscussion,
        "group leader",
        //this is undefined, even though the group does have a leader
        groupLeader,
    );

    //get discussion deadline. if zero the take current date, add discussion timelimit and update discussion with deadline.
    // else set deadline for instance to discussion deadline. use this value to have a timer show how long til discussion ends.
    if (discussionDeadline == null && discussionTimeLimit === 0) {
        //probably should refactor this
    } else if (discussionDeadline == null && discussionTimeLimit > 0) {
        let currentDateTime = new Date();
        updateDeadline(
            new Date(currentDateTime.getTime() + discussionTimeLimit * 60000)
        );
        Meteor.call(
            "discussions.updateDeadline",
            discussionId,
            mutableDiscussionDeadline
        );
    }

    if (discussionDeadline != null) {
        let currentTime = new Date();
        if (discussionDeadline < currentTime && discussionStatus === "active") {
            Meteor.call("discussions.updateStatus", discussionId, "timedout");
        } else if (discussionDeadline > currentTime && !timedDiscussion && discussionStatus === "active") {
            updateTimed();
            calculateTimeLeft();
            //maybe put the useEffect scroll to bottom controlling state change (vv line 189) here
        }
    }

    // //set reference for end of discussion and scroll to that point on page load, *
    // *set another of these to scroll the outer part of the page up again
    const commentsEndRef = useRef(null);
    const scrollToBottom = () => {
        commentsEndRef.current.scrollIntoView({behavior: "auto"});
    };

    useEffect(scrollToBottom, [comments]);

    const handleUserGroupLeaderVote = () => {
        setUserVotedForLeader(true);
    }

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

    const closeChat = () => {
        Meteor.call("discussions.updateStatus", discussionId, "finished");
    }

    const proposeVerdict = () =>
        Meteor.call("discussions.addProposer", discussionId);

    return (
        <div style={{width: "110vh"}}>
            <NavBar/>
            {/*hacky way to move content out from under menu*/}
            {/*<br/><br/>*/}
            <Container style={{position: "fixed", width: "110vh"}}>
                <Grid columns={2} style={{position: "fixed", width: "110vh"}}>
                    {/*<Grid.Row> //need to specify a row?*/}
                    {/*  <GridColumn width={3}>*/}
                    {/*    <Header*/}
                    {/*      content={(scenario && scenario.title) || (topic && topic.title)}*/}
                    {/*      size="medium"*/}
                    {/*    />*/}
                    {/*    {(scenario && scenario.description) ||*/}
                    {/*      (topic && topic.description)}*/}
                    {/*    {timedDiscussion && <Timer time={timeLeft} />}*/}
                    {/*  </GridColumn>*/}
                    <GridColumn width={10} attached="left">
                        <Comment.Group style={{overflow: "auto", height: "75vh"}}>
                            {comments &&
                            comments.map((comment) => (
                                <UserComment
                                    key={comment._id}
                                    comment={comment}
                                    // onEditClick={editComment}
                                    // onSubmitEditClick={updateComment}
                                    discussionStatus={discussionStatus}
                                    userCanEdit={
                                        discussionTemplate
                                            ? discussionTemplate.usersCanEditComments
                                            : true
                                    }
                                />
                            ))}
                            <div ref={commentsEndRef}/>
                        </Comment.Group>
                        {discussionStatus === "active" && (
                            <CommentForm discussionId={discussionId}/>
                        )}
                    </GridColumn>
                    <GridColumn width={4}>
                        <div style={{height: "87vh"}}>
                            {/* this area will change depending on if isDiscussion, hide verdict stuff if false */}
                            <Header content={isDiscussion ? "Verdicts" : "Leader"} size="medium"/>
                            <List style={{overflow: "auto", maxHeight: "50em"}}>
                                {isDiscussion && verdicts &&
                                verdicts.map((verdict) => (
                                    <List.Item key={verdict._id}>
                                        <Verdict
                                            key={verdict._id}
                                            verdict={verdict}
                                            onVote={hasReachedConsensus}
                                        />
                                    </List.Item>
                                ))}
                                {isDiscussion && group && hasReachedConsensus() && (
                                    <Modal open={true}>
                                        <Modal.Content>Consensus</Modal.Content>
                                        <Modal.Actions>
                                            <Button
                                                as={Link}
                                                to="/"
                                                content="Return to Dashboard"
                                            />
                                        </Modal.Actions>
                                    </Modal>
                                )}
                                {isDiscussion &&
                                !userHasSubmittedVerdict() &&
                                discussionVerdictProposers &&
                                discussionStatus === "active" &&
                                (discussionVerdictProposers.includes(Meteor.userId()) ? (
                                    <VerdictForm discussionId={discussionId}/>
                                ) : (
                                    <div style={{textAlign: "center"}}>
                                        <Button
                                            style={{margin: 10}}
                                            content="Propose Verdict"
                                            onClick={proposeVerdict}
                                            primary
                                        />
                                    </div>
                                ))}
                                {/* isf user is the group leader show this button */}
                                {groupLeader === Meteor.userId() &&
                                discussionStatus === "active" &&
                                <div style={{textAlign: "center"}}>
                                    <Button
                                        style={{margin: 10}}
                                        content="Close chat"
                                        onClick={closeChat}
                                        primary
                                    />
                                </div>
                                }
                                {/* tried to put this break in the above conditional but it didn't work, to refactor */}
                                <Segment style={{position: "absolute", bottom: "0px"}}>
                                    <Header content="Participants"/>
                                    {!isDiscussion && groupMembers.map((member) => (
                                        <List.Item key={member._id}>
                                            <UserSummary member={member}
                                                         handleUserVoted={handleUserGroupLeaderVote}
                                                         userHasVoted={userVotedForLeader}
                                                         groupId={group._id}
                                                         groupLeader={groupLeader}
                                                         discussionStatus={discussionStatus}
                                            />
                                        </List.Item>
                                    ))}
                                </Segment>
                            </List>
                        </div>
                    </GridColumn>
                    {/*</Grid.Row>*/}
                </Grid>
            </Container>
        </div>
    );
};
