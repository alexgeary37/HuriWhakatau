import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { Groups } from "/imports/api/groups";

export const createGroup = () =>
  Meteor.call("groups.insert", "Title" + Groups.find().count(), "desc");

export const Dashboard = () => {
  const { groups } = useTracker(() => {
    Meteor.subscribe("groups");

    return {
      groups: Groups.find({}).fetch(),
    };
  });

  return (
    <div className="dashboard">
      <h1>Groups</h1>
      <ul className="groups">
        {/* Change this for groups */}
        {groups.map((group) => (
          <div className="groupContainer" key={group._id}>
            <Button content={group.title} as={Link} to={`/${group._id}`} />
          </div>
        ))}
      </ul>
      <Button content="Create Group" onClick={createGroup} />
    </div>
  );
};
