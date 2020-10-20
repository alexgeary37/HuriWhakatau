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
                      backgroundColor: 'black'
                  //     backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedHorizontalMirrored.png"})`,
                  //     backgroundSize: '200px',
                  //     backgroundRepeat: 'round'
                  }}
            >
                <Container className="content-width"><Menu.Item as={Link} to="/"><Icon size="big" name="balance scale"/>
                </Menu.Item>
                    <Menu.Item as={Link} to="/">
                        <Header as={'h2'} inverted content={'Huri Whakatau'}/>
                    </Menu.Item>
                    <Dropdown item text="Tirotiro/Browse" as={'h2'}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link}  to="/mydashboard">
                                <h2>My Dash</h2>
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/UserSettings">
                                <h2>User settings</h2>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item>
                        {/*todo put discussion title / description here when I figure it out */}
                    </Menu.Item>
                    <MenuMenu position="right">
                        {!user &&
                        <MenuItem>
                            <Button as={'h2'}
                                onClick={() => {
                                    handleSignUp();
                                }}
                                content="Sign Up"
                                negative
                            />
                        </MenuItem>
                        }
                        {user ?
                            <MenuItem as={Link} as={'h2'} to="/" name="logout" onClick={logUserOut}>
                                Logout {user.username}
                                {/*todo replace icon with profile pic when that is ready*/}
                                <Icon name={"user"} size={"large"}/>
                            </MenuItem>
                            :
                            <MenuItem as={Link} to="/" name="login" onClick={toggleModal}>
                                <Header as={'h2'} inverted>Login</Header>
                            </MenuItem>
                        }
                        <MenuItem as={Link} to="/about" name="about">
                            <Header as={'h2'} inverted>About</Header>
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
