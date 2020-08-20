import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { Groups } from "/imports/api/groups";

export const BrowseGroups = () => {
  const { groups } = useTracker(() => {
    Meteor.subscribe("groups", Meteor.userId());

    return {
      groups: Groups.find().fetch(),
    };
  });

  return (
    <div className="browseGroups">
      <h1>Groups</h1>
      <ul className="groups">
        {groups.map((group) => (
          <div className="groupContainer" key={group._id}>
            <Button content={group.name} as={Link} to={`/${group._id}`} />
          </div>
        ))}
      </ul>
      <Button content="Create Group" as={Link} to={"/groups/create"} />
    </div>
  );
};
