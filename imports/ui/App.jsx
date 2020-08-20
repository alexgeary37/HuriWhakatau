import React from "react";
import { Router, Route, Switch } from "react-router";
import { Link, BrowserRouter } from "react-router-dom";
import history from "history";
import { Menu, Container, Dropdown, Icon } from "semantic-ui-react";
import { Dashboard } from "./Dashboard";
import { Discussion } from "./Discussion";
import {LoginForm} from "./LoginForm";

// Should this be a constant?????????????????????????????????????????????????????/
const browserHistory = history.createBrowserHistory();

export const App = () => {
  if (!Meteor.userId()) {
    return (
        <div className="dashboard-login">
          <LoginForm />
        </div>
    );
  }
  return (
    <Router history={browserHistory}>
        <BrowserRouter>
      <Menu fixed="top" inverted>
        <Container className="content-width">
          <Menu.Item as={Link} to="/" header>
            <Icon size="big" name="balance scale" />
            JuryRoom
          </Menu.Item>
          <Dropdown item text="Browse">
            <Dropdown.Menu>
              <Dropdown.Item
                content="Discussions"
                as={Link}
                to="/"
              />
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/:discussionId" component={Discussion} />
      </Switch>
        </BrowserRouter>
    </Router>
  );
};
