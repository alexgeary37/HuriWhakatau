import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import Select from "react-select";

const a1 = [
  { value: "Alex", label: "10" },
  { value: "Bob", label: "12" },
];

export const CreateGroup = () => {
  const { users } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      users: Meteor.users.find({}).fetch(),
    };
  });

  const getUsers = () => {
    console.log(users[0]);
    let userarray = [];
    for (var user in users) {
      let entry = { value: "", label: "" };
      entry.value = user._id;
      entry.label = user.username;
      console.log(entry.value);
      userarray += entry;
    }
    console.log("userarray", userarray[0]);
    return userarray;
  };

  return (
    <div>
      <Select options={getUsers()} isMulti />
    </div>
  );
};
