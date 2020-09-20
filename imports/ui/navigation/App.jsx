import React from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Router, Route, Switch} from "react-router";
import {BrowserRouter, useHistory} from "react-router-dom";
import history from "history";
import {Dashboard} from "./Dashboard";
import {BrowseGroups} from "/imports/ui/groups/BrowseGroups";
import {CreateGroup} from "/imports/ui/groups/CreateGroup";
import {BrowseScenarios} from "/imports/ui/scenarios/BrowseScenarios";
import {CreateScenario} from "/imports/ui/scenarios/CreateScenario";
import {BrowseScenarioSets} from "/imports/ui/scenarioSets/BrowseScenarioSets";
import {CreateScenarioSet} from "/imports/ui/scenarioSets/CreateScenarioSet";
import {CreateDiscussionTemplate} from "/imports/ui/discussionTemplates/CreateDiscussionTemplate";
import {CreateExperiment} from "/imports/ui/experiments/CreateExperiment";
import {Discussion} from "/imports/ui/discussions/Discussion";
import {MyDashboard} from "./MyDashboard";
import {AssignRoles} from "/imports/ui/users/AssignRoles";
import {AddUser } from "/imports/ui/users/AddUser";
import {EnrollForm} from "/imports/ui/users/EnrollForm";
import { UserSettings } from "/imports/ui/users/UserSettings"
import {HuiChat} from "/imports/ui/discussions/HuiChat"

const browserHistory = history.createBrowserHistory();

export const App = () => {
    const {user} = useTracker(() => {
        Meteor.subscribe("users");

        return {
            user: Meteor.userId(),
        };
    });

    return (
        <Router history={browserHistory}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/mydashboard" component={MyDashboard}/>
                    <Route exact path="/groups" component={BrowseGroups}/>
                    <Route exact path="/groups/create" component={CreateGroup}/>
                    <Route exact path="/scenarios" component={BrowseScenarios}/>
                    <Route exact path="/scenarios/create" component={CreateScenario}/>
                    <Route exact path="/scenarioSets" component={BrowseScenarioSets}/>
                    <Route exact path="/assignroles" component={AssignRoles}/>
                    <Route exact path="/AddUser" component={AddUser}/>
                    <Route exact path="/UserSettings" component={UserSettings}/>
                    <Route exact path="/huichat/:discussionId" component={HuiChat}/>
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
                    <Route
                        exact
                        path="/experiments/create"
                        component={CreateExperiment}
                    />
                    <Route path="/discussion/:discussionId" component={Discussion}/>
                    <Route path="/korerorero/:discussionId" component={Discussion}/>
                    <Route
                    exact
                    path="/enroll-account/:token"
                    component={EnrollForm}
                    />
                </Switch>
            </BrowserRouter>
        </Router>
    );
};
