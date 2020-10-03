import React from "react";
import { Meteor } from "meteor/meteor";
import { BrowserRouter, Route, Switch } from "react-router";
import { render } from "react-dom";
import { App } from "/imports/ui/navigation/App";

Meteor.startup(() => {
  render(<App />, document.getElementById("react-target"));
});
