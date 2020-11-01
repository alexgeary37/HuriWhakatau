import React from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Router, Route, Switch} from "react-router";
import {BrowserRouter, useHistory} from "react-router-dom";
import history from "history";
import {AddUser} from "/imports/ui/users/AddUser";
import {About} from "./About";
import {HuiChat} from "/imports/ui/discussions/HuiChat"
import {Dashboard} from "./Dashboard";
import {EnrollForm} from "/imports/ui/users/EnrollForm";
import {Discussion} from "/imports/ui/discussions/Discussion";
import {AssignRoles} from "/imports/ui/users/AssignRoles";
import {CreateGroup} from "/imports/ui/groups/CreateGroup";
import {MyDashboard} from "./MyDashboard";
import {UserSettings} from "/imports/ui/users/UserSettings"
import {BrowseGroups} from "/imports/ui/groups/BrowseGroups";
import {CreateScenario} from "/imports/ui/scenarios/CreateScenario";
import {BrowseScenarios} from "/imports/ui/scenarios/BrowseScenarios";
import {CreateExperiment} from "/imports/ui/experiments/CreateExperiment";
import {CreateScenarioSet} from "/imports/ui/scenarioSets/CreateScenarioSet";
import {BrowseScenarioSets} from "/imports/ui/scenarioSets/BrowseScenarioSets";
import {CreateDiscussionTemplate} from "/imports/ui/discussionTemplates/CreateDiscussionTemplate";

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
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/AddUser" component={AddUser}/>
                    <Route exact path="/assignroles" component={AssignRoles}/>
                    <Route path="/discussion/:discussionId" component={Discussion}/>
                    <Route exact path="/groups" component={BrowseGroups}/>
                    <Route exact path="/groups/create" component={CreateGroup}/>
                    <Route exact path="/mydashboard" component={MyDashboard}/>
                    <Route exact path="/scenarios" component={BrowseScenarios}/>
                    <Route exact path="/scenarios/create" component={CreateScenario}/>
                    <Route exact path="/scenarioSets" component={BrowseScenarioSets}/>
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
                    <Route path="/korerorero/:discussionId"
                           component={Discussion}/> {/* probably not needed double up of the huichat path*/}
                    <Route
                        exact
                        path="/enroll-account/:token"
                        component={EnrollForm}
                    />
                    <Route
                        exact
                        path="/enroll-account/:token/:invitingUser"
                        component={EnrollForm}
                    />
                </Switch>
            </BrowserRouter>
        </Router>
    );
};
