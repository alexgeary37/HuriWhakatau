import React, {useEffect, useRef, useState} from "react";
import {
    Container, Segment, Header, Button, Comment,
    Modal, Grid, GridColumn, List, GridRow, Divider,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "/imports/api/security";
import {useTracker} from "meteor/react-meteor-data";
import {Link, useParams, useHistory} from "react-router-dom";
import {Groups} from "/imports/api/groups";
import {Topics} from "/imports/api/topics";
import {Verdicts} from "/imports/api/verdicts";
import {Comments} from "/imports/api/comments";
import {Scenarios} from "/imports/api/scenarios";
import {Discussions} from "/imports/api/discussions";
import {DiscussionTemplates} from "/imports/api/discussionTemplate";
import {Verdict} from "/imports/ui/verdicts/Verdict";
import {CommentForm} from "/imports/ui/comments/CommentForm";
import {UserComment} from "/imports/ui/comments/UserComment";
import {VerdictForm} from "/imports/ui/verdicts/VerdictForm";
import {UserSummary} from "/imports/ui/users/UserSummary";
import {Experiments} from "../../api/experiments";
import {huichatTour} from "../../api/tourSteps";
import Cookies from "universal-cookie/lib";
import {Tour} from "../navigation/Tour";
import {Layout} from "../navigation/Layout";

//adaption of the Discussion.jsx to bring it in line with Tamahau's designs
export const HuiChat = () => {
    const cookies = new Cookies();
    const [showTour, setShowTour] = useState(false);
    const filter = {};
    const {discussionId} = useParams();
    const [userVotedForLeader, setUserVotedForLeader] = useState(false); ///
    const [userInGroup, setUserInGroup] = useState(false); //set if user is in the discussion group and
    let history = useHistory();

    const toggleShowTour = () => {
        if (!cookies.get('huichatTour')) {
            setShowTour(!showTour);
        }
    }

    useEffect(() => {
        toggleShowTour();
    }, []);

    const {
        scenario,
        group,
        topic,
        discussionVerdictProposers,
        comments,
        verdicts,
        discussionStatus,
        discussionTemplate,
        // discussionDeadline,
        // discussionTimeLimit,
        groupMembers, ///
        groupLeader, ///
        leaderVotes,
        nextDiscussion, ///
        isIntroduction, ///
        discussionIsPublic,
        experimentId,
    } = useTracker(() => {
        const discussionSub = Meteor.subscribe("discussions", discussionId);
        const scenarioSub = Meteor.subscribe("scenarios");
        const groupSub = Meteor.subscribe("groups");
        const topicSub = Meteor.subscribe("topics");
        const discussionTemplateSub = Meteor.subscribe("discussionTemplates");
        const subExperiments = Meteor.subscribe("experiments");
        Meteor.subscribe("comments", discussionId);
        Meteor.subscribe("verdicts", discussionId);
        Meteor.subscribe("roles");
        Meteor.subscribe("users"); ///

        let verdictProposers;
        let discussionScenario;
        let discussionGroup;
        let discussionState;
        // let discussionTimeLimit;
        // let discussionDeadline;
        let discussionTopic;
        let discussionTemplate;
        let groupMembers = []; ///
        let theGroupLeader; ///
        let numVotes = 0;
        let nextDiscussionId;
        let discussionIsIntroduction; ///
        let publicDiscussion;
        let experiment;
        let experimentId;
        if (
            discussionSub.ready() &&
            scenarioSub.ready() &&
            groupSub.ready() &&
            topicSub.ready() &&
            discussionTemplateSub.ready() &&
            subExperiments.ready()
        ) {
            let discussion = Discussions.findOne({});
            discussionIsIntroduction = discussion.isIntroduction; ///
            discussionScenario = Scenarios.findOne({_id: discussion.scenarioId});
            discussionGroup = Groups.findOne({_id: discussion.groupId});
            verdictProposers = discussion.activeVerdictProposers;
            discussionState = discussion.status;
            discussionTemplate = DiscussionTemplates.findOne({
                _id: discussionScenario.discussionTemplateId,
            });

            publicDiscussion = discussion.isPublic ? discussion.isPublic : false;
            discussionTopic = Topics.findOne({_id: discussionScenario.topicId});
            nextDiscussionId = discussion.nextDiscussion
                ? discussion.nextDiscussion
                : null;

            /// WHOLE BLOCK BELOW
            groupMembers = Meteor.users.find({
                _id: {$in: discussionGroup.members},
            }).fetch();
            //get the experiment id for the discussion and the group leader
            experiment = Experiments.findOne({discussions: {$elemMatch: {$eq: discussionId}}}, {
                fields: {
                    groupLeader: 1,
                    leaderVotes: 1
                }
            })
            experimentId = experiment._id;
            theGroupLeader = experiment.groupLeader;
            let leaderVoteKeys = Object.keys(experiment.leaderVotes);
            leaderVoteKeys.forEach((key) => {
                numVotes += experiment.leaderVotes[key];
            });
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
            // discussionTimeLimit: discussionTimeLimit,
            // discussionDeadline: discussionDeadline,
            groupMembers: groupMembers, ///
            groupLeader: theGroupLeader, ///
            leaderVotes: numVotes,
            nextDiscussion: nextDiscussionId, ///
            discussionIsPublic: publicDiscussion,
            isIntroduction: discussionIsIntroduction, ///
            experimentId: experimentId,
        };
    });

    //check if user is in the discussion group
    const checkGroupMembership = () => {
        if (group && group.members.includes(Meteor.userId())) {
            setUserInGroup(true);
            console.log("user in group");
        } else {
            console.log("user not in group");
        }
    }

    useEffect(() => {
        checkGroupMembership();
        document.title = "HuiChat - " + (scenario && scenario.title)
    }, [group]);

    // //set reference for end of discussion and scroll to that point on page load, *
    const commentsEndRef = useRef(null);
    const scrollToBottom = () => {
        commentsEndRef.current.scrollIntoView({behavior: "auto"});
    };

    useEffect(scrollToBottom, [, comments.filter(x => x.authorId === Meteor.userId()).length]);

    const handleUserGroupLeaderVote = () => {
        setUserVotedForLeader(true);
    };

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
        if (nextDiscussion) {
            history.push("/huichat/" + nextDiscussion);
        }
        Meteor.call("discussions.updateStatus", discussionId, "finished");
    };

    const proposeVerdict = () =>
        Meteor.call("discussions.addProposer", discussionId);

    const huiChatPageContent = (userLang) => {
        return (
            <Container>
                {showTour &&
                <Tour TOUR_STEPS={huichatTour}/>
                }
                <Segment vertical>
                    <Grid columns={3} style={{width: "110vh"}} container>
                        <GridRow>
                            <GridColumn width={8} attached="left" textAlign={'left'}>
                                <Comment.Group style={{overflow: "auto", height: "65vh"}}>
                                    {comments &&
                                    comments.map((comment) => (
                                        <UserComment
                                            key={comment._id}
                                            comment={comment}
                                            discussionStatus={discussionStatus}
                                            groupLeader={groupLeader}
                                            userCanEdit={
                                                discussionTemplate
                                                    ? discussionTemplate.usersCanEditComments
                                                    : true
                                            }
                                        />
                                    ))}
                                    <div ref={commentsEndRef}/>
                                </Comment.Group>
                                {discussionStatus === "active" && (discussionIsPublic || userInGroup) && (
                                    <CommentForm
                                        discussionId={discussionId}
                                        isDiscussionPublic={discussionIsPublic}
                                        isUserAGroupMember={userInGroup}
                                        groupId={group._id}
                                    />)}
                            </GridColumn>
                            <GridColumn width={4}>
                                <div style={{height: "83vh"}}>
                                    <Header
                                        inverted
                                        content={(scenario && scenario.title) || (topic && topic.title)}
                                        size="medium"
                                    />
                                    <Divider/>
                                    {/* replace the topic with scenario only once old data is cleared out */}
                                    <Header as={'h5'} inverted
                                            content=
                                                {(scenario && scenario.description) ||
                                                (topic && topic.description)}
                                    />
                                    <List style={{overflow: "auto", maxHeight: "50em"}}>
                                        <Segment
                                            style={{
                                                position: "absolute",
                                                bottom: "0px",
                                                overflow: "auto",
                                                height: "50vh",
                                                padding: "5px",
                                            }}>
                                            <Header content="Participants"/>
                                            {isIntroduction &&
                                            <div>Leader Votes cast: {leaderVotes + " / " + groupMembers.length}</div>}
                                            <Segment.Group>
                                                {groupMembers &&
                                                groupMembers.map((member) => (
                                                    <List.Item key={member._id}>
                                                        <UserSummary
                                                            member={member}
                                                            handleUserVoted={handleUserGroupLeaderVote}
                                                            userHasVoted={userVotedForLeader}
                                                            groupId={group._id}
                                                            groupLeader={groupLeader}
                                                            discussionStatus={discussionStatus}
                                                            closeChat={closeChat}
                                                            discussionId={discussionId}
                                                            nextDiscussionId={nextDiscussion}
                                                            experimentId={experimentId}
                                                        />
                                                    </List.Item>
                                                ))}
                                            </Segment.Group>
                                        </Segment>
                                    </List>
                                </div>
                            </GridColumn>
                            <GridColumn width={4}>
                                <div style={{height: "83vh"}}>
                                    {/* this area will change depending on if isIntroduction, hide verdict stuff if true */}
                                    <Header
                                        content={isIntroduction ? "" : "Verdicts"}
                                        size="medium"
                                        inverted
                                    />
                                    <Divider/>
                                    <List style={{overflow: "auto", maxHeight: "50em"}}>
                                        {!isIntroduction &&
                                        verdicts &&
                                        verdicts.map((verdict) => (
                                            <List.Item key={verdict._id}>
                                                <Verdict
                                                    key={verdict._id}
                                                    verdict={verdict}
                                                    discussionStatus={discussionStatus}
                                                    onVote={hasReachedConsensus}
                                                />
                                            </List.Item>
                                        ))}
                                        {!isIntroduction && group && hasReachedConsensus() && (
                                            <Modal open={true}>
                                                <Modal.Content>Consensus</Modal.Content>
                                                <Modal.Actions>
                                                    {nextDiscussion &&
                                                    <Button as={Link}
                                                            to={"/huichat/" + nextDiscussion}
                                                            content={"Next discussion"}/>}
                                                    <Button as={Link} to="/mydashboard"
                                                            content="Return to Dashboard"/>
                                                    <Button content="View Discussion"
                                                            onClick={() => setOpenConsensusModal('closed')}/>
                                                </Modal.Actions>
                                            </Modal>
                                        )}
                                        {!isIntroduction &&
                                        !userHasSubmittedVerdict() &&
                                        discussionVerdictProposers &&
                                        discussionStatus === "active" &&
                                        Meteor.userId() === groupLeader &&
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
                                    </List>
                                </div>
                            </GridColumn>
                        </GridRow>
                    </Grid>
                </Segment>
            </Container>
        );
    }

    return (
        <Layout page={huiChatPageContent}/>
    );
};
