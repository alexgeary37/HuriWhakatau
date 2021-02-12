import React from "react";
import TextTrim from "react-text-trim";
import { useTracker } from "meteor/react-meteor-data";
import { List, Button, Card, Header } from "semantic-ui-react";

export const Verdict = ({
  verdict,
  onVote,
  discussionStatus,
  discussionIsPublic,
  userInGroup,
}) => {
  // useTracker makes sure the component will re-render when the data changes.
  const { user } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      user: Meteor.users.findOne({ _id: verdict.authorId }),
    };
  });

  const handleVoteClick = (vote) => {
    Meteor.call("verdicts.addVote", verdict._id, vote, (e, result) => {
      if (result) {
        onVote();
      }
    });
  };

  // Return true if this user has voted on this verdict, false otherwise.
  const userHasVoted = () => {
    return verdict.votes.findIndex((x) => x.userId === Meteor.userId()) !== -1;
  };

  const renderButtons = () => {
    // IF the discussion is active and the user is not the verdict author, display "Affirm" and "Reject" buttons.
    if (discussionStatus === "active") {
      return (
        <div style={{ paddingBottom: 5, textAlign: "center" }}>
          <Button
            content="Affirm"
            onClick={() => handleVoteClick(true)}
            positive
            size="mini"
          />
          <Button
            content="Reject"
            onClick={() => handleVoteClick(false)}
            negative
            size="mini"
          />
        </div>
      );
    } else {
      return (
        <div style={{ paddingBottom: 5, textAlign: "center" }}>
          <Button content="Affirm" disabled size="mini" />
          <Button content="Reject" disabled size="mini" />
        </div>
      );
    }
  };

  return (
    <List.Item>
      <Card color="yellow" fluid>
        <Card.Content>
          <Header size="small" content={user && user.username} />
          <Header
            sub
            size="tiny"
            color="grey"
            content={verdict.postedTime.toDateString()}
          />
          <Card.Description>
            <TextTrim
              refId="VerdictTrim"
              text={verdict.text}
              minLines={5}
              maxLines={10}
              showMoreLabel="Show More"
              showLessLabel="Show Less"
              delimiter="..."
              fontSize={14}
              lineHeight={16}
              containerStyle={{}}
              textWrapperStyle={{}}
              buttonStyle={{}}
            />
          </Card.Description>
        </Card.Content>
        {/* User needs to vote on the verdict */}
        {userInGroup && Meteor.userId() !== verdict.authorId &&
          !userHasVoted() &&
          renderButtons()}
        {/* Indicate to the user that they voted */}
        {userInGroup && Meteor.userId() !== verdict.authorId && userHasVoted() && (
          <div style={{ padding: 5, textAlign: "right" }}>Voted</div>
        )}
      </Card>
    </List.Item>
  );
};
