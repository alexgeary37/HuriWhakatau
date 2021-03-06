import React from "react";
import {Router, Route, Switch} from "react-router";
import {BrowserRouter} from "react-router-dom";
import history from "history";
import {FAQ} from "./FAQ";
import {About} from "./About";
import {AddUser} from "/imports/ui/users/AddUser";
import {Page404} from "./404";
import {HuiChat} from "/imports/ui/discussions/HuiChat"
import {Dashboard} from "./Dashboard";
import {EnrollForm} from "/imports/ui/users/EnrollForm";
import {ResetPasswordForm} from "/imports/ui/users/ResetPasswordForm";
import {Discussion} from "/imports/ui/discussions/Discussion";
import {MyDashboard} from "./MyDashboard";
import {UserSettings} from "/imports/ui/users/UserSettings"
import {ConfirmationForm} from "../users/ConfirmationForm";

const browserHistory = history.createBrowserHistory();

export const App = () => {

    return (
        <Router history={browserHistory}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/FAQ" component={FAQ}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/AddUser" component={AddUser}/>
                    <Route path="/discussion/:discussionId" component={Discussion}/>
                    {/*<Route exact path="/groups" component={BrowseGroups}/>*/}
                    {/*<Route exact path="/groups/create" component={CreateGroup}/>*/}
                    <Route exact path="/mydashboard" component={MyDashboard}/>
                    {/*<Route exact path="/scenarios" component={BrowseScenarios}/>*/}
                    {/*<Route exact path="/scenarios/create" component={CreateScenario}/>*/}
                    {/*<Route exact path="/scenarioSets" component={BrowseScenarioSets}/>*/}
                    <Route exact path="/UserSettings" component={UserSettings}/>
                    <Route exact path="/huichat/:discussionId" component={HuiChat}/>
                    {/*<Route*/}
                    {/*    exact*/}
                    {/*    path="/scenarioSets/create"*/}
                    {/*    component={CreateScenarioSet}*/}
                    {/*/>*/}
                    {/*<Route*/}
                    {/*    exact*/}
                    {/*    path="/discussiontemplates/create"*/}
                    {/*    component={CreateDiscussionTemplate}*/}
                    {/*/>*/}
                    {/*<Route*/}
                    {/*    exact*/}
                    {/*    path="/experiments/create"*/}
                    {/*    component={CreateExperiment}*/}
                    {/*/>*/}
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
                    <Route
                        exact
                        path="/confirm-identity/:token/:userId"
                        component={ConfirmationForm}
                    />
                    <Route
                        exact
                        path="/reset-password/:token"
                        component={ResetPasswordForm}
                    />
                    <Route component={Page404}/>
                </Switch>
            </BrowserRouter>
        </Router>
    );
};
