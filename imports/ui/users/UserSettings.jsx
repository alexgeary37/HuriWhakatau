import "/imports/api/security";
import "/imports/api/users";
import React, {useState, useEffect, useRef} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {myUserSettings} from "../../api/tourSteps";
import {Tour} from "../navigation/Tour";
import {
    Input, Button, Label, Card, Container, Segment, Dropdown,
    Header, Icon, Form, Grid, GridColumn, CardContent, Divider
} from "semantic-ui-react";
import {Mountains} from "/imports/api/mountains";
import {Rivers} from "../../api/rivers";
import {Layout} from "../navigation/Layout";
import Cookies from "universal-cookie/lib";
import {siteGlossary} from "../../api/glossary";


export const UserSettings = () => {
    const cookies = new Cookies();

    useEffect(() => {
        document.title = "User Settings"
    }, [])

    const [showTour, setShowTour] = useState(false);
    const {user, mountains, rivers} = useTracker(() => {
        Meteor.subscribe("users");
        Meteor.subscribe("mountains");
        Meteor.subscribe("rivers");

        return {
            user: Meteor.users.findOne(Meteor.userId()),
            mountains: Mountains.find().fetch(),
            rivers: Rivers.find().fetch(),
        };
    });
    const pepehaWaka = ["Aotea", "Te Arawa", "Kurahaupō", "Mātaatua", "Tainui", "Tākitimu", "Tokomaru"];
    const pepehaIwi = ["No affiliation", "Hauraki Māori", "Ngāi Tahu", "Ngāi Tahu Whanui", "Ngāpuhi",
        "Ngāti Kahungunu", "Ngāti Maniapoto", "Ngāti Porou", "Ngāti Raukawa", "Ngāti Ruanui", "Ngāti Tama",
        "Ngāti Toa", "Ngāti Tūwharetoa", "Ngāti Whātua", "Te Arawa", "Te Atiawa", "Te Ātiawa", "Te Hiku, or Muriwhenua",
        "Tūhoe", "Waikato Tainui", "Whakatōhea"];

    const [changeUserPassword, setChangeUserPassword] = useState(false);
    const [userNewPassword, setUserNewPassword] = useState("");
    const [userOldPassword, setUserOldPassword] = useState("");
    const [changeUserDetails, setChangeUserDetails] = useState(false);
    const [changeUsername, setChangeUsername] = useState(false);
    const [isIndigenous, setIsIndigenous] = useState(false);
    const [userMountain, setUserMountain] = useState("");
    const [changeUserPepeha, setChangeUserPepeha] = useState(false);
    const [pepehaObject, setPepehaObject] =
        useState({
            mountain: "",
            river: "",
            waka: "",
            iwi: "",
            role: ""
        });
    const [userDetailsObject, setUserDetailsObject] =
        useState({
            firstName: "",
            lastName: "",
            dob: "",
            ethnicity: "",
            gender: "",
            religion: "",
            location: "",
        });
    const [userRiver, setUserRiver] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userWaka, setUserWaka] = useState("");
    const [username, setUsername] = useState("");
    const [userIwi, setUserIwi] = useState("");
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userLocation, setUserLocation] = useState("");
    const [userEthnicity, setUserEthnicity] = useState("");
    const [userGender, setUserGender] = useState("");
    const [userReligion, setUserReligion] = useState("");
    const [userDoB, setUserDoB] = useState("");
    const [err, setErr] = useState("");
    const [userFeedback, setUserFeedback] = useState("");
    useEffect(() => {
        if (user /*&& isIndigenous*/ && !changeUserPepeha && !changeUserDetails && !changeUsername) {
            setUsername(user.username);

            if (user.profile.userDetails) {
                setUserFirstName(user.profile.userDetails.firstName);
                setUserLastName(user.profile.userDetails.lastName);
                setUserGender(user.profile.userDetails.gender);
                setUserReligion(user.profile.userDetails.religion);
                setUserEthnicity(user.profile.userDetails.ethnicity);
                setUserLocation(user.profile.userDetails.location);
                setUserDoB(user.profile.userDetails.dob);
            }
            if (user.profile.pepeha) {
                setUserMountain(user.profile.pepeha.mountain);
                setUserRiver(user.profile.pepeha.river);
                setUserWaka(user.profile.pepeha.waka);
                setUserIwi(user.profile.pepeha.iwi);
                setUserRole(user.profile.pepeha.role);
            }
        }
    }, [user]);

    const toggleShowTour = () => {
        if (!cookies.get('pepehaTour')) {
            setShowTour(!showTour);
        }
    }

    useEffect(() => {
        toggleShowTour();
    }, []);

    //get user participant role status and update variable with call back.
    // possibly this should be a Promise?
    Meteor.call("security.hasRole", Meteor.userId(), "PARTICIPANT_I", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        setIsIndigenous(result);
    });

    const exportUserData = () => {
        // Meteor.call("users.exportUserData", Meteor.userId());
        Meteor.call("users.validateUserForDataExport", Meteor.userId());
    }

    //reference boolean to for the useEffect callback sending the changed pepeha list to the db
    const settingUserDetailsRef = useRef(false);
    //ensure the pepeha state variable is finished updating before sending to db. Modeled
    // on the comment reactions. Need to change so something more like a key:value is sent.
    useEffect(() => {
        if (settingUserDetailsRef.current) {
            settingUserDetailsRef.current = false;
            Meteor.call("users.updateUserDetails", userDetailsObject, Meteor.userId());
        }
    }, [userDetailsObject]);

    //reference boolean to for the useEffect callback sending the changed pepeha list to the db
    const settingPepehaRef = useRef(false);
    //ensure the pepeha state variable is finished updating before sending to db. Modeled
    // on the comment reactions. Need to change so something more like a key:value is sent.
    useEffect(() => {
        if (settingPepehaRef.current) {
            settingPepehaRef.current = false;
            Meteor.call("users.updatePepeha", pepehaObject, Meteor.userId());
        }
    }, [pepehaObject]);


    const updateUserDetails = () => {
        setUserDetailsObject({
            firstName: userFirstName,
            lastName: userLastName, dob: userDoB, gender: userGender,
            religion: userReligion, ethnicity: userEthnicity, location: userLocation
        })
    }

    const updatePepeha = () => {
        setPepehaObject({
            mountain: userMountain, river: userRiver,
            waka: userWaka, iwi: userIwi, role: userRole
        })
    }

    const updateUsername = () => {
        Meteor.call("users.updateUsername", username, Meteor.userId());
    };

    const updateUserPassword = () => {
        if (userNewPassword.length < 8) {
            setErr("Password must have at least 8 characters")
        } else {
            Accounts.changePassword(userOldPassword, userNewPassword);
            setChangeUserPassword(false);
        }
    };

    const handleUpdateUserDetails = () => {
        if (changeUserDetails) {
            updateUserDetails();
        }
        setChangeUserDetails(!changeUserDetails);
    }

    const handleUpdatePepeha = () => {
        if (changeUserPepeha) {
            updatePepeha();
        }
        setChangeUserPepeha(!changeUserPepeha);
    }

    const sendFeedback = () => {
        if (userFeedback.length > 0) {
            Meteor.call("users.sendFeedback", userFeedback)
            setUserFeedback("");
        }
    }

    const userSettingsPageContent = (userLang) => {
        return (
            <Container textAlign='left'
                       inverted={"true"} style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                {showTour &&
                <Tour TOUR_STEPS={myUserSettings}/>
                }
                <Segment attached={"top"} clearing inverted
                         style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
                    <Header size={"huge"}>
                        <Header.Content as={Container} fluid>
                            My Account - {user && user.username}
                        </Header.Content>
                    </Header>
                </Segment>
                <Grid stackable columns={2}>
                    <GridColumn width={9}>
                        <Segment fluid={"true"} inverted style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                            <Card.Content header="Account Details"/>
                            <CardContent>
                                <Form>
                                    {/*    change username & stuff   */}

                                    <Input labelPosition={"left"}
                                           type={"text"}
                                           value={user && username}
                                           readOnly={!changeUsername}
                                        // size="mini"
                                           style={{width: "45%"}}
                                           onChange={({target}) => setUsername(target.value)}>
                                        <Label style={{width: "55%"}}>Username</Label>
                                        <input/>
                                        {!changeUsername ? (
                                            <Button type={"button"} size="mini" content="Change"
                                                    onClick={() => {
                                                        setChangeUsername(true)
                                                    }}/>
                                        ) : (
                                            < Button type={"button"} size="mini" content="Save" onClick={() => {
                                                setChangeUsername(false);
                                                updateUsername();
                                            }}/>
                                        )}
                                    </Input>
                                    <br/>
                                    <br/>
                                    {/*    change password stuff   */}
                                    <Input labelPosition="left"
                                           placeholder={changeUserPassword ? "Enter New Password" : "Password"}
                                           type="password"
                                           value={userOldPassword}
                                           readOnly={!changeUserPassword}
                                           size="mini"
                                           style={{width: "45%"}}
                                           onChange={({target}) => setUserOldPassword(target.value)}>
                                        <Label style={{width: "55%"}}>Password</Label>
                                        <input/>
                                        {!changeUserPassword &&
                                        <Button type="button" size="mini" content="Change" onClick={() => {
                                            setChangeUserPassword(true);
                                            setUserOldPassword("");
                                        }}/>
                                        }
                                    </Input>
                                    <br/>
                                    <br/>
                                    {changeUserPassword && <div>
                                        <Form.Input labelPosition="left"
                                                    placeholder={"Re-enter New Password"}
                                                    type="password"
                                                    value={userNewPassword}
                                                    error={userNewPassword.length < 8}
                                            // size="mini"
                                                    style={{width: "45%"}}
                                                    onChange={({target}) => setUserNewPassword(target.value)}>
                                            <Label>New Password</Label>
                                            <input/>
                                            <Form.Button type="button" size="mini" content="Save"
                                                         onClick={() => {
                                                             updateUserPassword();
                                                         }}/>
                                        </Form.Input>
                                        {err ? (
                                            <div style={{height: "10px", color: "red"}}>{err}</div>
                                        ) : (
                                            <div style={{height: "10px"}}/>
                                        )}
                                    </div>
                                    }
                                    <Divider/>
                                    <Card.Content header="User Details"/>
                                    <br/>
                                    <Input value={user && userFirstName}
                                           placeholder={"Enter First Name"}
                                           aria-label={'Enter First Name'}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserFirstName(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdateUserDetails()
                                           }}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userLastName}
                                           placeholder={"Enter Last Name"}
                                           aria-label={'Enter Last Name'}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserLastName(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdateUserDetails()
                                           }}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userGender}
                                           placeholder={"Enter Gender"}
                                           aria-label={'Enter Gender'}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserGender(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdateUserDetails()
                                           }}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userDoB}
                                           placeholder={"Enter Date of Birth"}
                                           aria-label={'Enter Date of Birth'}
                                           type="date"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserDoB(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdateUserDetails()
                                           }}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userEthnicity}
                                           placeholder={"Enter Ethnic Identity"}
                                           aria-label={'Enter Ethnic Identity'}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserEthnicity(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdateUserDetails()
                                           }}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userReligion}
                                           placeholder={"Enter Religion"}
                                           aria-label={'Enter Religion'}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserReligion(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdateUserDetails()
                                           }}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userLocation}
                                           placeholder={"Enter Location"}
                                           aria-label={'Enter Location'}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserLocation(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdateUserDetails()
                                           }}
                                    />
                                    <br/>
                                    <br/>
                                </Form>
                            </CardContent>
                        </Segment>
                        <Segment fluid={"true"} inverted style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                            {/* to implement */}
                            {/*<Card.Content header={"Profile Picture"}/>*/}
                            {/*<CardContent>*/}
                            {/*    user pic shit*/}
                            {/*    <AvatarEditor*/}
                            {/*        image="http://example.com/initialimage.jpg"*/}
                            {/*        width={250}*/}
                            {/*        height={250}*/}
                            {/*        border={50}*/}
                            {/*        color={[255, 255, 255, 0.6]} // RGBA*/}
                            {/*        scale={1.2}*/}
                            {/*        rotate={0}*/}
                            {/*    />*/}
                            {/*</CardContent>*/}
                        </Segment>

                    </GridColumn>
                    <GridColumn width={7}>
                        {/*re-add the isIndigenous check later*/}
                        {/*{isIndigenous &&*/}
                        <Segment fluid={"true"} inverted style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                            <Card.Content header="Pepeha" className={'myPepeha'}/>
                            <CardContent>
                                <Form>
                                    <Dropdown
                                        text={userMountain}
                                        value={userMountain}
                                        placeholder={'Select Mountain'}
                                        name="mountain"
                                        aria-label={'Pepeha Mountain'}
                                        readOnly={!changeUserPepeha}
                                        lazyLoad
                                        allowAdditions
                                        selection
                                        search
                                        options={
                                            mountains &&
                                            mountains.map((mountain) => ({
                                                key: mountain._id,
                                                text: mountain.name,
                                                value: mountain.name,
                                            }))
                                        }
                                        onChange={(e, {value}) => {
                                            setUserMountain(value)
                                        }}
                                        onClick={() => {
                                            handleUpdatePepeha()
                                            settingPepehaRef.current = true
                                        }}
                                        onBlur={() => {
                                            handleUpdatePepeha()
                                        }}
                                    />
                                    <Button type="button" icon style={{marginLeft: "20px"}}>
                                        <Icon className="mountain"/>
                                    </Button>
                                    <br/>
                                    <br/>
                                    <Dropdown
                                        text={userRiver}
                                        value={userRiver}
                                        placeholder={'Select River'}
                                        aria-label={'Pepeha River'}
                                        name="river"
                                        readOnly={!changeUserPepeha}
                                        lazyLoad
                                        allowAdditions
                                        selection
                                        search
                                        options={
                                            rivers &&
                                            rivers.map((river) => ({
                                                key: river._id,
                                                text: river.name,
                                                value: river.name,
                                            }))
                                        }
                                        onChange={(e, {value}) => {
                                            setUserRiver(value)
                                        }}
                                        onClick={() => {
                                            handleUpdatePepeha()
                                            settingPepehaRef.current = true
                                        }}
                                        onBlur={() => {
                                            handleUpdatePepeha()
                                        }}
                                    />
                                    <Button type="button" icon style={{marginLeft: "20px"}}>
                                        <Icon className="river"/>
                                    </Button>
                                    <br/>
                                    <br/>
                                    <Dropdown
                                        text={userWaka}
                                        value={userWaka}
                                        placeholder={'Select Waka'}
                                        aria-label={'Pepeha Waka'}
                                        name="waka"
                                        readOnly={!changeUserPepeha}
                                        lazyLoad
                                        selection
                                        search
                                        options={
                                            pepehaWaka &&
                                            pepehaWaka.map((waka) => ({
                                                key: waka,
                                                text: waka,
                                                value: waka,
                                            }))
                                        }
                                        onChange={(e, {value}) => {
                                            setUserWaka(value)
                                        }}
                                        onClick={() => {
                                            handleUpdatePepeha()
                                            settingPepehaRef.current = true
                                        }}
                                        onBlur={() => {
                                            handleUpdatePepeha()
                                        }}
                                    />
                                    <Button type="button" icon style={{marginLeft: "20px"}}>
                                        <Icon className="waka"/>
                                    </Button>
                                    <br/>
                                    <br/>
                                    <Dropdown
                                        text={userIwi}
                                        value={userIwi}
                                        placeholder={'Select Iwi'}
                                        aria-label={'Pepeha Iwi'}
                                        name="iwi"
                                        readOnly={!changeUserPepeha}
                                        lazyLoad
                                        selection
                                        search
                                        options={
                                            pepehaIwi &&
                                            pepehaIwi.map((iwi) => ({
                                                key: iwi,
                                                text: iwi,
                                                value: iwi,
                                            }))
                                        }
                                        onChange={(e, {value}) => {
                                            setUserIwi(value)
                                        }}
                                        onClick={() => {
                                            handleUpdatePepeha()
                                            settingPepehaRef.current = true
                                        }}
                                        onBlur={() => {
                                            handleUpdatePepeha()
                                        }}
                                    />
                                    <Button type="button" icon style={{marginLeft: "20px"}}>
                                        <Icon className="iwi"/>
                                    </Button>
                                    <br/>
                                    <br/>
                                    <Input value={user && userRole}
                                           placeholder={"Enter Employment or Role"}
                                           aria-label={'Pepeha Employment or Role'}
                                           type="text"
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserRole(target.value)}
                                           onClick={() => {
                                               handleUpdatePepeha()
                                               settingPepehaRef.current = true
                                           }}
                                           onBlur={() => {
                                               handleUpdatePepeha()
                                           }}
                                    >
                                        <input/>
                                        <Button type="button" icon style={{marginLeft: "20px"}}>
                                            <Icon className="role"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    Get your personalised Pepeha: <a
                                    href={'https://pepeha.nz/'}>https://pepeha.nz/</a>
                                </Form>
                            </CardContent>
                        </Segment>
                        {/*}*/}
                        <Segment fluid={"true"} inverted>
                            <Card.Content header={'Privacy'}/>
                            <Divider/>
                            <CardContent>
                                <p>Pursuant to the <a
                                    href={'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23342.html'}
                                    target={"_blank"}>NZ
                                    Privacy Act 2020, Part 3, Subpart 1, Information Privacy
                                    Principle 6.1.a</a> you are entitled to any
                                    information that has been collected about you. Upon request well will send
                                    all data that is associated with your account.
                                    This will include all comments you have authored or interacted with, all
                                    personality questions you have answered along with score and all of your
                                    profile information. Click the button below to initiate, you will receive an
                                    email to confirm your identity. Once confirmed your data will be sent via
                                    email.</p>
                                <Button content={"Send me my data"} onClick={exportUserData}/>
                                <Divider/>
                                {siteGlossary.siteName[userLang]} takes privacy and data sovereignty seriously.
                                But we are fallible humans, if there is anything we have overlooked or
                                undervalued please let us know. User feedback is anonymous, if you would like a
                                response please include an email address.
                                <br/>
                                Send {siteGlossary.siteName[userLang]} a message:
                                <Form>
                                    <Form.Field
                                        control={'textarea'}
                                        title={'Privacy Feedback'}
                                        value={userFeedback}
                                        onChange={(event) => setUserFeedback(event.currentTarget.value)}/>
                                    <Button
                                        content="Send feedback"
                                        onClick={(e) => {
                                            sendFeedback();
                                        }}
                                        positive
                                    />
                                </Form>
                            </CardContent>
                        </Segment>
                    </GridColumn>
                </Grid>
            </Container>
        );
    }

    return (
        <Layout page={userSettingsPageContent}/>
    );
}
