import "/imports/api/security";
import React, {useState, useEffect} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {
    Input,
    Button,
    Label,
    Card,
    Container,
    Segment,
    Header,
    List,
    Icon,
    Divider,
    Form,
    Grid,
    GridColumn, GridRow, CardHeader, CardContent
} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";

export const UserSettings = () => {
    const [username, setUsername] = useState("OpenlyOctopus");
    const handleUsername = () => {
        setUsername(user.username);
    };
    const [changeUsername, setChangeUsername] = useState(false);
    const [changeUserPassword, setChangeUserPassword] = useState(false);

    const [userNewPassword, setUserNewPassword] = useState("");
    const [userOldPassword, setUserOldPassword] = useState(null);
    const [isIndigenous, setIsIndigenous] = useState(false);
    const [userMountain, setUserMountain] = useState("");
    const [userRiver, setUserRiver] = useState("");
    const [userWaka, setUserWaka] = useState("");
    const [userIwi, setUserIwi] = useState("");
    const [err, setErr] = useState("");
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
        // Meteor.call("security.changeUsername", username);
    };
    const updateUserPassword = () => {
        if(userNewPassword.length < 8){
            setErr("Password must have at least 8 characters")
        } else {
            Accounts.changePassword(userOldPassword, userNewPassword);
            setChangeUserPassword(false);
        }
    }

    return (
        <div>
            <NavBar />
            <Container>
                <Segment attached="top" clearing>
                    <Header size="huge">
                        <Header.Content as={Container} fluid>
                            My Account - {user && user.username}
                        </Header.Content>
                    </Header>
                </Segment>
                <Grid  columns={2}>
                    <GridColumn width={9}>
                        <Card>
                            <Card.Content header="Account Details"/>
                            <CardContent>
                                <Form>

                                    <Input labelPosition="left"
                                           type="text"
                                           value={user && username}
                                           readOnly={!changeUsername}
                                           size="mini"
                                           style={{width:"45%"}}
                                           onInput={({target}) => setUsername(target.value)}>
                                        <Label>Username</Label>
                                        <input />
                                        {!changeUsername ? (
                                            <Button size="mini" content="Change" onClick={() => {setChangeUsername(true)}}/>
                                            ) : (
                                                < Button size="mini" content="Save" onClick={ () => {
                                            setChangeUsername(false);
                                            updateUsername();
                                        }}/>
                                        )
                                        }
                                    </Input>
                                    <br/>
                                    <br/>
                                {/*    change password stuff   */}

                                    <Input labelPosition="left"
                                           type="password"
                                           value={userOldPassword}
                                           readOnly={!changeUserPassword}
                                           size="mini"
                                           style={{width:"45%"}}
                                           onInput={({target}) => setUserOldPassword(target.value)}>
                                        <Label>Password</Label>
                                        <input />
                                        {!changeUserPassword &&
                                            <Button size="mini" content="Change" onClick={() => {
                                                setChangeUserPassword(true);
                                                setUserOldPassword("");}}/>
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
                                        <div style={{ height: "10px", color: "red" }}>{err}</div>
                                        ) : (
                                        <div style={{ height: "10px" }} />
                                        )}
                                        </div>
                                    }
                                </Form>
                            </CardContent>
                        </Card>
                        <Card>
                            <Card.Content header="stuff"/>
                            <CardContent>


                            </CardContent>
                        </Card>
                    </GridColumn>
                    {/*<GridColumn width={5}>*/}

                    {/*</GridColumn>*/}
                    <GridColumn width={7}>
                        {!isIndigenous &&
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
                                    >
                                        <Label style={{width: "55%"}}>Iwi</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="iwi"/>
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
