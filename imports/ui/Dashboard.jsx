import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { Discussions } from "/imports/api/discussions";
import { Scenarios } from "/imports/api/scenarios";
import { LoginForm } from "./LoginForm";

export const createDiscussion = () =>
  Meteor.call(
    "discussions.insert",
    "Title" + Discussions.find().count(),
    "desc"
  );

export const Dashboard = () => {
  const { user, discussions, scenarios } = useTracker(() => {
    Meteor.subscribe("discussions");
    Meteor.subscribe("scenarios");

    return {
      user: Meteor.userId(),
      discussions: Discussions.find({}).fetch(),
      scenarios: Scenarios.find({}).fetch(),
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
          <div className="discussionContainer" key={discussion._id}>
            <Button
              content={discussion.title}
              as={Link}
              to={`/${discussion._id}`}
            />
          </div>
        ))}
      </ul>
      <Button content="Create Discussion" onClick={createDiscussion} />
    </div>
  );
};
