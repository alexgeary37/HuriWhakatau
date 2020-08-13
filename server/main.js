import { Meteor } from "meteor/meteor";
import "/imports/api/comments";

Meteor.startup(() => {
  if (!Accounts.findUserByUsername("meteorite")) {
    Accounts.createUser({
      username: "meteorite",
      password: "password",
    });
  }
});
