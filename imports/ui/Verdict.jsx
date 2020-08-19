import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import classnames from "classnames";
import { Votes } from "../api/votes";

export const Verdict = ({ verdict }) => {
  let classes = classnames("verdict");

  if (Meteor.userId() === verdict.authorId) {
    classes = classnames("verdict usersVerdict");
  }

  // useTracker makes sure the component will re-render when the data changes.
  const { verdictVotes } = useTracker(() => {
    Meteor.subscribe("votes", verdict._id);

    return {
      verdictVotes: Votes.find().fetch(),
    };
  });

  const handleVoteClick = (vote) =>
    Meteor.call("votes.insert", verdict._id, vote);

  // Return true if this user has voted on this verdict, false otherwise.
  const userHasVoted = () => {
    return verdictVotes.findIndex((x) => x.userId === Meteor.userId()) !== -1;
  };

  return (
    <li className={classes}>
      <span>{verdict.text}</span>
      {Meteor.userId() !== verdict.authorId && !userHasVoted() && (
        <div>
          <button onClick={() => handleVoteClick(true)}>Affirm</button>
          <button onClick={() => handleVoteClick(false)}>Reject</button>
        </div>
      )}
    </li>
  );
};
