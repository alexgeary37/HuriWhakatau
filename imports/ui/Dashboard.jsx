import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Button } from "semantic-ui-react";
import { Discussions } from "/imports/api/discussions";
import { DiscussionSummary } from "./DiscussionSummary";
import { Groups } from "/imports/api/groups";
import { LoginForm } from "./LoginForm";

export const Dashboard = () => {
  const { user, discussions } = useTracker(() => {
    Meteor.subscribe("groups");
    Meteor.subscribe("discussions");

    return {
      user: Meteor.userId(),
      discussions: Discussions.find({}).fetch(),
    };
  });

  if (!user) {
    return (
      <div className="dashboard-login">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <h2>My discussions</h2>
      <ul className="discussions">
        {discussions.map((discussion) => (
          // <div className="discussionContainer" key={discussion._id}>
          <DiscussionSummary key={discussion._id} discussion={discussion} />
          // </div>
        ))}
      </ul>
    </div>
  );
};
