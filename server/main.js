import { Meteor } from "meteor/meteor";
import "/imports/api/comments";
import "/imports/api/discussions";

Meteor.startup(() => {
  // Create accounts
  if (!Accounts.findUserByUsername("alex")) {
    Accounts.createUser({
      username: "alex",
      password: "password1",
    });
  }
  if (!Accounts.findUserByUsername("geary")) {
    Accounts.createUser({
      username: "geary",
      password: "password2",
    });
  }
  if (!Accounts.findUserByUsername("alexgeary")) {
    Accounts.createUser({
      username: "alexgeary",
      password: "password3",
    });
  }
});
