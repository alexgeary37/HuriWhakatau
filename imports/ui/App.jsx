import React from "react";
import { Router, Route, Switch } from "react-router";
import history from "history";
import { Dashboard } from "./Dashboard";
import { Discussion } from "./Discussion";

const browserHistory = history.createBrowserHistory();

export const App = () => {
  return (
    <Router history={browserHistory}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/discussion/" component={Discussion} />
      </Switch>
    </Router>
  );
};
