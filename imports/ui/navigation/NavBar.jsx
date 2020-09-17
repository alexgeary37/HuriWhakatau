import React, { useState } from "react";
import {
  Menu,
  Container,
  Icon,
  Dropdown,
  MenuItem,
  MenuMenu,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import {useTracker} from "meteor/react-meteor-data";
import { LoginForm } from "/imports/ui/users/LoginForm";


export const NavBar = () => {
  const [showLogin, setShowLogin] = useState(false);

  const {user} = useTracker(() => {
    Meteor.subscribe("users");
    return {
      user: Meteor.users.findOne({_id: Meteor.userId()}),
    };
  });

  const logUserOut = () => {
    Accounts.logout();
  };

  const logUserIn = () => {
    setShowLogin(true);
    // return(
    //     // <div className="dashboard-login">
    //       <LoginForm />
    //     // </div>
    // );
  };

  //todo, remove the links to Groups, Scenarios and Scenario sets when we're sure they aren't needed.
  return (
    <div className="navbar">
      <Menu fixed="top" inverted>
        <Container className="content-width">
          <Menu.Item as={Link} to="/" header>
            <Icon size="big" name="balance scale" />
            Huri Whakatau
          </Menu.Item>
          <Dropdown item text="Tirotiro/Browse">
            <Dropdown.Menu>
              <Dropdown.Item
                content="Groups (redundant)"
                as={Link}
                to="/groups"
              />
              <Dropdown.Item
                content="Scenarios (redundant)"
                as={Link}
                to="/scenarios"
              />
              <Dropdown.Item
                content="Scenario Sets (redundant)"
                as={Link}
                to="/scenarioSets"
              />
              <Dropdown.Item content="My Dash" as={Link} to="/mydashboard" />
            </Dropdown.Menu>
          </Dropdown>
          <MenuMenu position="right">
            {user ?
              <MenuItem as={Link} to="/" name="logout" onClick={logUserOut}>
                Logout {user.username}
              </MenuItem>
              :
                <MenuItem as={Link} to="/" name="login" onClick={logUserIn}>
                  Login
                </MenuItem>
            }
          </MenuMenu>
        </Container>
      </Menu>
      {showLogin &&
      <div className="dashboard-login">
        <LoginForm />
      </div>
      }
    </div>

  );
};
