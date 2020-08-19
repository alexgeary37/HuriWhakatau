import React from "react";
import { Router, Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import history from "history";
import { Menu, Container, Dropdown, Icon } from "semantic-ui-react";
import { Dashboard } from "./Dashboard";
//import { BrowseGroups } from "./BrowseGroups";
import { Discussion } from "./Discussion";

// Should this be a constant?????????????????????????????????????????????????????/
const browserHistory = history.createBrowserHistory();

export const App = () => {
  return (
    <Router history={browserHistory}>
        {/*<Menu fixed="top" inverted>
        <Container className="content-width">
          <Menu.Item as={Link} to="/" header>
            <Icon size="big" name="balance scale" />
            JuryRoom
          </Menu.Item>
          <Dropdown item text="Browse">
            <Dropdown.Menu>
              <Dropdown.Item content="Groups" as={Link} to="/groups" />
            </Dropdown.Menu>
          </Dropdown>
        </Container>
        </Menu>*/}
      <Switch>
        <Route exact path="/" component={Dashboard} />
        {/*<Route exact path="/groups" component={BrowseGroups} />*/}
        <Route exact path="/:discussionId" component={Discussion} />
      </Switch>
    </Router>
  );
};
