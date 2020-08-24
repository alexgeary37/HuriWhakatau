import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";
import { Votes } from "../api/votes";
import {
  List,
  Segment,
  Button,
  Divider,
  Card,
  Header,
  Comment,
  Modal,
} from "semantic-ui-react";

export const Verdict = ({ verdict }) => {
  let classes = classnames("verdict");

  if (Meteor.userId() === verdict.authorId) {
    classes = classnames("verdict usersVerdict");
  }

  // useTracker makes sure the component will re-render when the data changes.
  const { user, verdictVotes } = useTracker(() => {
    Meteor.subscribe("votes", verdict._id);
    Meteor.subscribe("users");

    return {
      verdictVotes: Votes.find().fetch(),
      user: Meteor.users.findOne({ _id: verdict.authorId }),
    };
  });

  const handleVoteClick = (vote) =>
    Meteor.call("votes.insert", verdict._id, vote);

  // Return true if this user has voted on this verdict, false otherwise.
  const userHasVoted = () => {
    return verdictVotes.findIndex((x) => x.userId === Meteor.userId()) !== -1;
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
