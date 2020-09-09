import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Router, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import history from "history";
import { Dashboard } from "./Dashboard";
import { BrowseGroups } from "./BrowseGroups";
import { CreateGroup } from "./CreateGroup";
import { BrowseScenarios } from "./BrowseScenarios";
import { CreateScenario } from "./CreateScenario";
import { BrowseScenarioSets } from "./BrowseScenarioSets";
import { CreateScenarioSet } from "./CreateScenarioSet";
import { CreateDiscussionTemplate } from "./CreateDiscussionTemplate";
import { Discussion } from "./Discussion";
import { MyDashboard } from "./MyDashboard";


const browserHistory = history.createBrowserHistory();

export const App = () => {
  const { user } = useTracker(() => {
    Meteor.subscribe("users");

    return {
      user: Meteor.userId(),
    };
  });

  return (
    <Router history={browserHistory}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/mydashboard" component={MyDashboard} />
          <Route exact path="/groups" component={BrowseGroups} />
          <Route exact path="/groups/create" component={CreateGroup} />
          <Route exact path="/scenarios" component={BrowseScenarios} />
          <Route exact path="/scenarios/create" component={CreateScenario} />
          <Route exact path="/scenarioSets" component={BrowseScenarioSets} />
          <Route
            exact
            path="/scenarioSets/create"
            component={CreateScenarioSet}
          />
          <Route
              exact
              path="/discussiontemplates/create"
              component={CreateDiscussionTemplate}
          />
          <Route path="/discussion/:discussionId" component={Discussion} />
        </Switch>
      </BrowserRouter>
    </Router>
  );
};
