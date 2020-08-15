import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { Discussions } from "/imports/api/discussions";
import { LoginForm } from "./LoginForm";

export const createDiscussion = () =>
  Meteor.call(
    "discussions.insert",
    "Title" + Discussions.find().count(),
    "desc"
  );

export const Dashboard = () => {
  const { user, discussions } = useTracker(() => {
    Meteor.subscribe("discussions");

    return {
      user: Meteor.user(),
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
      <Button content="Create Discussion" onClick={createDiscussion} />
      <Button content="Enter Discussion" as={Link} to="/discussion/" />
    </div>
  );
};
