import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { List, Button, Card, Header } from "semantic-ui-react";

export const Verdict = ({ verdict, onVote }) => {
  // useTracker makes sure the component will re-render when the data changes.
  const { user } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      user: Meteor.users.findOne({ _id: verdict.authorId }),
    };
  });

  const handleVoteClick = (vote) => {
    console.log("handleVoteClick", vote);
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
          <Card.Description content={verdict.text} />
        </Card.Content>
        {Meteor.userId() !== verdict.authorId && !userHasVoted() ? (
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
        ) : (
          <div style={{ paddingBottom: 5, textAlign: "right" }}>Voted</div>
        )}
      </Card>
    </List.Item>
  );
};
