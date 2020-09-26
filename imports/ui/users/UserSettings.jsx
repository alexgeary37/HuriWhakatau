import "/imports/api/security";
import React, {useState, useEffect, useRef} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {
    Input,
    Button,
    Label,
    Card,
    Container,
    Segment,
    Header,
    Icon,
    Form,
    Grid,
    GridColumn, CardContent
} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";

export const UserSettings = () => {
    const [changeUserPassword, setChangeUserPassword] = useState(false);
    const [userNewPassword, setUserNewPassword] = useState("");
    const [userOldPassword, setUserOldPassword] = useState("");
    const [changeUsername, setChangeUsername] = useState(false);
    const [isIndigenous, setIsIndigenous] = useState(false);
    const [userMountain, setUserMountain] = useState("");
    const [userPepeha, setUserPepeha] = useState([]);
    const [userRiver, setUserRiver] = useState("");
    const [userRole, setUserRole] = useState("");
    const [username, setUsername] = useState("OpenlyOctopus"); // todo, fix getting the username.
    const [name, setName] = useState("");
    const [userWaka, setUserWaka] = useState("");
    const [userIwi, setUserIwi] = useState("");
    const [err, setErr] = useState("");
    const handleUsername = () => { // need to work out how to set this when user info is loaded rather than hard coded as below
        setUsername(user.username);};
    //reference boolean to for the useEffect callback sending the changed pepeha list to the db
    const settingPepehaRef = useRef(false);
    //ensure the pepeha state variable is finished updating before sending to db.
    useEffect(() => {
        if (settingPepehaRef.current) {
            settingPepehaRef.current = false;
            Meteor.call("security.updatePepeha", userPepeha, Meteor.userId());
        }
    }, [userPepeha]);

    const handlePepehaSelect = () => {
        settingPepehaRef.current = true;
        setUserPepeha([...userPepeha, userRiver]);
    }
    //get user participant role status and update variable with call back.
    // possibly this should be a Promise?
    Meteor.call("security.hasRole", Meteor.userId(), "PARTICIPANT_I", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        setIsIndigenous(result);
    });

    // useTracker makes sure the component will re-render when the data changes.
    const {user} = useTracker(() => {
        Meteor.subscribe("users");
        return {
            user: Meteor.users.findOne({_id: Meteor.userId()}),
        };
    });

    const updateUsername = () => {
        Accounts.setUsername(Meteor.userId(), username);
    };

    const updateUserPassword = () => {
        if (userNewPassword.length < 8) {
            setErr("Password must have at least 8 characters")
        } else {
            Accounts.changePassword(userOldPassword, userNewPassword);
            setChangeUserPassword(false);
        }
    }

    return (
        <div>
            <NavBar/>
            <Container>
                <Segment attached="top" clearing>
                    <Header size="huge">
                        <Header.Content as={Container} fluid>
                            My Account - {user && user.username}
                        </Header.Content>
                    </Header>
                </Segment>
                <Grid columns={2}>
                    <GridColumn width={9}>
                        <Card>
                            <Card.Content header="Account Details"/>
                            <CardContent>
                                <Form>
                                    {/*    change username stuff   */}
                                    <Input labelPosition="left"
                                           type="text"
                                           value={user && name}
                                           readOnly={"true"}
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setName(target.value)}>
                                        <Label>Name</Label>
                                        <input/>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input labelPosition="left"
                                           type="text"
                                           value={user && username}
                                           readOnly={!changeUsername}
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setUsername(target.value)}>
                                        <Label>Username</Label>
                                        <input/>
                                        {!changeUsername ? (
                                            <Button size="mini" content="Change" onClick={() => {
                                                setChangeUsername(true)
                                            }}/>
                                        ) : (
                                            < Button size="mini" content="Save" onClick={() => {
                                                setChangeUsername(false);
                                                updateUsername();
                                            }}/>
                                        )}
                                    </Input>
                                    <br/>
                                    <br/>
                                    {/*    change password stuff   */}
                                    <Input labelPosition="left"
                                           type="password"
                                           value={userOldPassword}
                                           readOnly={!changeUserPassword}
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setUserOldPassword(target.value)}>
                                        <Label>Password</Label>
                                        <input/>
                                        {!changeUserPassword &&
                                        <Button size="mini" content="Change" onClick={() => {
                                            setChangeUserPassword(true);
                                            setUserOldPassword("");
                                        }}/>
                                        }
                                    </Input>
                                    <br/>
                                    <br/>
                                    {changeUserPassword && <div>
                                        <Form.Input labelPosition="left"
                                                    type="password"
                                                    value={userNewPassword}
                                            // readOnly={!changeUserPassword}
                                                    error={userNewPassword.length < 8}
                                                    size="mini"
                                                    style={{width: "45%"}}
                                                    onInput={({target}) => setUserNewPassword(target.value)}>
                                            <Label>New Password</Label>
                                            <input/>
                                            <Form.Button size="mini" content="Save" onClick={() => {
                                                // setChangeUserPassword(false);

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
                                </Form>
                            </CardContent>
                        </Card>
                        <Card>
                            <Card.Content header="Profile Picture"/>
                            <CardContent>
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
                            </CardContent>
                        </Card>
                    </GridColumn>
                    <GridColumn width={7}>
                        {isIndigenous &&
                        <Card>
                            <Card.Content header="Pepeha"/>
                            <CardContent>
                                <Form>
                                    <Input value={userMountain}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setUserMountain(target.value)}
                                           onChange={handlePepehaSelect}
                                    >
                                        <Label style={{width: "55%"}}>Mountain</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="mountain"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={userRiver}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setUserRiver(target.value)}
                                           onChange={console.log("changed")}
                                    >
                                        <Label style={{width: "55%"}}>River</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="river"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={userWaka}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setUserWaka(target.value)}
                                           onChange={() => {settingPepehaRef.current = true;
                                               setUserPepeha([...userPepeha, target.value])}}
                                    >
                                        <Label style={{width: "55%"}}>Waka</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="waka"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={userIwi}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setUserIwi(target.value)}
                                           onChange={({target}) => {settingPepehaRef.current = true;
                                               setUserPepeha([...userPepeha, target.value])}}
                                    >
                                        <Label style={{width: "55%"}}>Iwi</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="iwi"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={userRole}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           onInput={({target}) => setUserRole(target.value)}
                                           onChange={({target}) => {settingPepehaRef.current = true;
                                               setUserPepeha([...userPepeha, target.value])}}
                                    >
                                        <Label style={{width: "55%"}}>Employment/Role</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="role"/>
                                        </Button>
                                    </Input>
                                </Form>
                            </CardContent>
                        </Card>
                        }
                    </GridColumn>
                </Grid>
            </Container>
        </div>
    );
}
