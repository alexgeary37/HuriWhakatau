import React, {useState} from "react";
import {
    Menu,
    Container,
    Icon,
    Dropdown,
    MenuItem,
    MenuMenu,
    Button, HeaderContent, Header,
} from "semantic-ui-react";
import {Link, useHistory} from "react-router-dom";
import {useTracker} from "meteor/react-meteor-data";
import {LoginForm} from "/imports/ui/users/LoginForm";

export const NavBar = () => {
    const [showLogin, setShowLogin] = useState(false);
    let history = useHistory();
    const {user} = useTracker(() => {
        Meteor.subscribe("users");
        return {
            user: Meteor.users.findOne({_id: Meteor.userId()}),
        };
    });
    const logUserOut = () => {
        Accounts.logout();
    };
    const toggleModal = () => {
        setShowLogin(!showLogin);
    };
    const handleSignUp = () => {
        history.push("/AddUser");
    }
    return (
        <div className="navbar">
            <Menu fixed="top" inverted
                  style={{
                      backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedHorizontalMirrored.png"})`,
                      backgroundSize: '200px',
                      backgroundRepeat: 'round'
                  }}
            >
                <Container className="content-width"><Menu.Item as={Link} to="/"><Icon size="big" name="balance scale"/>
                </Menu.Item>
                    <Menu.Item as={Link} to="/">
                        <Header inverted> Huri Whakatau</Header>
                    </Menu.Item>
                    <Dropdown item text="Tirotiro/Browse" as={Header}>
                        <Dropdown.Menu>
                            <Dropdown.Item content="My Dash" as={Link} to="/mydashboard"/>
                            <Dropdown.Item content="User settings" as={Link} to="/UserSettings"/>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item>
                        {/*todo put discussion title / description here when I figure it out */}
                    </Menu.Item>
                    <MenuMenu position="right">
                        {!user &&
                        <MenuItem>
                            <Button
                                onClick={() => {
                                    handleSignUp();
                                }}
                                content="Sign Up"
                                negative
                            />
                        </MenuItem>
                        }
                        {user ?
                            <MenuItem as={Link} to="/" name="logout" onClick={logUserOut}>
                                Logout {user.username}
                                {/*todo replace icon with profile pic when that is ready*/}
                                <Icon name={"user"} size={"large"}/>
                            </MenuItem>
                            :
                            <MenuItem as={Link} to="/" name="login" onClick={toggleModal}>
                                <Header inverted>Login</Header>
                            </MenuItem>
                        }
                        <MenuItem as={Link} to="/about" name="about">
                            <Header inverted>About</Header>
                        </MenuItem>
                    </MenuMenu>
                </Container>
            </Menu>
            {showLogin &&
            <div className="dashboard-login">
                <LoginForm
                toggleLogin={toggleModal}
                />
            </div>
            }
        </div>

    );
};
