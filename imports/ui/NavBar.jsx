import React from "react";
import { Menu, Container, Icon, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <div className="navbar">
      <Menu fixed="top" inverted>
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
              <Dropdown.Item content="My Dash" as={Link} to="/mydashboard" />
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
    </div>
  );
};
