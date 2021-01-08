import React, {useEffect, useState} from "react";
import {
    Menu, Container, Dropdown,
    MenuItem, MenuMenu, Button, Header,
} from "semantic-ui-react";
import Cookies from "universal-cookie/lib";
import {siteGlossary} from "../../api/glossary";
import {Link, useHistory} from "react-router-dom";
import {useTracker} from "meteor/react-meteor-data";
import {LoginForm} from "/imports/ui/users/LoginForm";
import {AcceptCookies} from "./cookieAccept";

export const NavBar = ({handleChangeLanguage}) => {
    const [showLogin, setShowLogin] = useState(false);
    const [userLang, setUserLang] = useState("mā"); //defaulting to māori language
    const cookies = new Cookies();
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
    };
    //set user preferred language in a cookie
    const updateUserLang = (lang) => {
        //add cookie with selected value
        cookies.set('lang', lang, { path: '/' });

        handleChangeLanguage(cookies.get('lang'));
        setUserLang(cookies.get('lang'));
    }

    useEffect(()=>{
        if(cookies.get('lang')){
            setUserLang(cookies.get('lang'))
        } else {
            cookies.set('lang', "mā", { path: '/' });
        }
    },[]);

    return (
        <div className="navbar">
            <AcceptCookies />
            <Menu fixed="top" inverted
                  aria-label="Fern header image"
                  size={'large'}
                  style={{
                      backgroundColor: 'black',
                      backgroundImage: `url(${"/fren_gradient_extended_4.png"})`,
                      // backgroundSize: '200px',
                      backgroundRepeat: 'round',
                  }}
            >
                <Container className="content-width">
                    <Menu.Item as={Link} to="/">
                        <Header as={'h2'} inverted content={siteGlossary.siteName[userLang]} style={{fontFamily: 'Tamaiti'}}/>
                    </Menu.Item>
                    {/*todo put discussion title / description here when I figure it out */}
                    <MenuMenu position="right">
                        <Dropdown item text={"Language"}
                                  style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '22px'}}>
                            <Dropdown.Menu>
                                {siteGlossary.languages && Object.keys(siteGlossary.languages).map((langKey)=>(
                                    <Dropdown.Item style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '20px'}}
                                                   key={langKey}
                                                   text={siteGlossary.languages[langKey]}
                                                   value={langKey}
                                                   onClick={(e, data) => updateUserLang(data.value)}
                                    />
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        {!user && false && // hiding signup button for now.
                            <MenuItem>
                                <Button as={'h2'}
                                        onClick={() => {
                                            handleSignUp();
                                        }}
                                        className={'signUp'}
                                        content="Sign Up"
                                        negative
                                        style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '24px'}}
                                />
                            </MenuItem>
                        }
                        {user ?
                            <MenuItem as={Button} name="logout" onClick={logUserOut}
                                      style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '24px'}}>
                                Logout
                            </MenuItem>
                            :
                            <MenuItem as={Button} name="login" onClick={toggleModal}>
                                <Header as={'h2'} inverted style={{
                                    fontFamily: 'Tamaiti',
                                    fontWeight: 'bold',
                                    fontSize: '24px'
                                }}>Login</Header>
                            </MenuItem>
                        }
                        {user &&
                        <MenuItem>
                            <Dropdown text={user.username}
                                      compact
                                      inverted={"true"}
                                      style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '24px'}}>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to={"/mydashboard"}
                                                   text={'My Dashboard'}
                                                   style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '15px'}}>
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to={"/UserSettings"}
                                                   text={'User settings'}
                                                   style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '20px'}}>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </MenuItem>
                        }
                        <MenuItem as={Link} to="/about" name="about">
                            <Header as={'h2'} inverted
                                    style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '24px'}}>About</Header>
                        </MenuItem>
                        <MenuItem as={Link} to="/FAQ" name="FAQ">
                            <Header as={'h2'} inverted
                                    style={{fontFamily: 'Tamaiti', fontWeight: 'bold', fontSize: '24px'}}>FAQ</Header>
                        </MenuItem>
                    </MenuMenu>
                </Container>
            </Menu>
            {showLogin &&
            <div className="dashboard-login">
                <LoginForm
                    toggleModal={toggleModal}
                />
            </div>
            }
        </div>

    );
};
