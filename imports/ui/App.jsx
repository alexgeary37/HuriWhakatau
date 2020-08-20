import React from "react";
import { Router, Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import history from "history";
import { Menu, Container, Dropdown, Icon } from "semantic-ui-react";
import { Dashboard } from "./Dashboard";
import { BrowseGroups } from "./BrowseGroups";
import { CreateGroup } from "./CreateGroup";
import { Discussion } from "./Discussion";
import { LoginForm } from "./LoginForm";

// Should this be a constant?????????????????????????????????????????????????????/
const browserHistory = history.createBrowserHistory();
let userDude = Meteor.userId();

export const App = () => {
  console.log(userDude);
  if (!Meteor.userId()) {
    return (
      <div className="dashboard-login">
        <LoginForm />
      </div>
    );
  }

  return (
    <Router history={browserHistory}>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/groups" component={BrowseGroups} />
        <Route exact path="/groups/create" component={CreateGroup} />
        <Route exact path="/:discussionId" component={Discussion} />
      </Switch>
    </Router>
  );
};

//  <Menu fixed="top" inverted>
//   <Container className="content-width">
//     <Menu.Item as={Link} to="/" header>
//       <Icon size="big" name="balance scale" />
//       JuryRoom
//     </Menu.Item>
//     <Dropdown item text="Browse">
//       <Dropdown.Menu>
//         <Dropdown.Item content="Groups" as={Link} to="/groups" />
//       </Dropdown.Menu>
//     </Dropdown>
//   </Container>
// </Menu>
