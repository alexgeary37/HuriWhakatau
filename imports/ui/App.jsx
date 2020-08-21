import React from "react";
import { Router, Route, Switch } from "react-router";
import { Link, BrowserRouter } from "react-router-dom";
import history from "history";
import { Menu, Container, Dropdown, Icon } from "semantic-ui-react";
import { Dashboard } from "./Dashboard";
import { BrowseGroups } from "./BrowseGroups";
import { CreateGroup } from "./CreateGroup";
import { BrowseScenarios } from "./BrowseScenarios";
import { CreateScenario } from "./CreateScenario";
import { BrowseScenarioSets } from "./BrowseScenarioSets";
import { CreateScenarioSet } from "./CreateScenarioSet";
import { Discussion } from "./Discussion";

const browserHistory = history.createBrowserHistory();

export const App = () => {
  return (
    <Router history={browserHistory}>
      <BrowserRouter>
        {/* <Menu fixed="top" inverted> */}
        <Container className="content-width">
          <Menu.Item as={Link} to="/" header>
            <Icon size="big" name="balance scale" />
            JuryRoom
          </Menu.Item>
          <Dropdown item text="Browse">
            <Dropdown.Menu>
              <Dropdown.Item content="Groups" as={Link} to="/groups" />
              <Dropdown.Item content="Scenarios" as={Link} to="/scenarios" />
              <Dropdown.Item
                content="Scenario Sets"
                as={Link}
                to="/scenarioSets"
              />
            </Dropdown.Menu>
          </Dropdown>
        </Container>
        {/* </Menu> */}
        <Switch>
          <Route exact path="/" component={Dashboard} />
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
          <Route path="/discussion/:discussionId" component={Discussion} />
        </Switch>
      </BrowserRouter>
    </Router>
  );
};
