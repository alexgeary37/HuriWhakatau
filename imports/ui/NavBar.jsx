import React from "react";
import {Menu, Container, Icon, Dropdown, MenuItem, MenuMenu} from "semantic-ui-react";
import {Link} from "react-router-dom";

export const NavBar = () => {
    const logUserOut = () => {
        Accounts.logout();
    }
    //todo, remove the links to Grousp, Scenarios and Scenario sets when we're sure they aren't needed.
    return (
        <div className="navbar">
            <Menu fixed="top" inverted>
                <Container className="content-width">
                    <Menu.Item as={Link} to="/" header>
                        <Icon size="big" name="balance scale"/>
                        JuryRoom
                    </Menu.Item>
                    <Dropdown item text="Browse">
                        <Dropdown.Menu>
                            <Dropdown.Item content="Groups (redundant)" as={Link} to="/groups"/>
                            <Dropdown.Item content="Scenarios (redundant)" as={Link} to="/scenarios"/>
                            <Dropdown.Item
                                content="Scenario Sets (redundant)"
                                as={Link}
                                to="/scenarioSets"
                            />
                            <Dropdown.Item content="My Dash" as={Link} to="/mydashboard"/>
                        </Dropdown.Menu>
                    </Dropdown>
                    <MenuMenu position='right'>
                        <MenuItem
                            as={Link} to="/"
                            name='logout'
                            onClick={logUserOut}>
                            Logout
                        </MenuItem>
                    </MenuMenu>
                </Container>
            </Menu>
        </div>
    );
};
