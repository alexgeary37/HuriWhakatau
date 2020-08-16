import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Router, Route, Switch } from "react-router";
import history from "history";
import { Dashboard } from "./Dashboard";
import { Discussion } from "./Discussion";
import { LoginForm } from "./LoginForm";

const browserHistory = history.createBrowserHistory();

export const App = () => {
    const { user } = useTracker(() => {
        return {
            user: Meteor.user(),
        };
    });

    console.log(user);
    if (!user) {
        return (
            <div className="juryroom">
                <LoginForm />
            </div>
        );
    }

    return (
    <Router history={browserHistory}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/discussion/" component={Discussion} />
      </Switch>
    </Router>
  );
};
