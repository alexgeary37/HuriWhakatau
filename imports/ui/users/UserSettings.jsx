import "/imports/api/security";
import "/imports/api/users";
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
    GridColumn, CardContent, Dropdown, Divider
} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {Mountains} from "/imports/api/mountains";

export const UserSettings = () => {
    const {user, mountains} = useTracker(() => {
        Meteor.subscribe("users");
        Meteor.subscribe("mountains");
        return {
            user: Meteor.users.findOne({_id: Meteor.userId()}),
            mountains: Mountains.find().fetch(),
        };
    });

    // console.log("mount", mountains[0]);
    const [changeUserPassword, setChangeUserPassword] = useState(false);
    const [userNewPassword, setUserNewPassword] = useState("");
    const [userOldPassword, setUserOldPassword] = useState("");
    const [changeUserDetails, setChangeUserDetails] = useState(false);
    const [changeUsername, setChangeUsername] = useState(false);
    // const [changeName, setChangeName] = useState(false);
    const [isIndigenous, setIsIndigenous] = useState(false);
    const [userMountain, setUserMountain] = useState("");
    const [changeUserPepeha, setChangeUserPepeha] = useState(false);
    const [pepehaObject, setPepehaObject] =
        useState({mountain:"",
                            river:"",
                            waka:"",
                            iwi:"",
                            role:""});
    const [userDetailsObject, setUserDetailsObject] =
        useState({firstName: "",
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
    // const [name, setName] = useState("");
    const [err, setErr] = useState("");
    useEffect(() => {
        if (user /*&& isIndigenous*/ && !changeUserPepeha && !changeUserDetails && !changeUsername) {
            console.log("Adding info to states");
            setUsername(user.username);

            if(user.userDetails){
                setUserFirstName(user.userDetails.firstName);
                setUserLastName(user.userDetails.lastName);
                setUserGender(user.userDetails.gender);
                setUserReligion(user.userDetails.religion);
                setUserEthnicity(user.userDetails.ethnicity);
                setUserLocation(user.userDetails.location);
                setUserDoB(user.userDetails.dob);
            }
            if (user.pepeha) {
                setUserMountain(user.pepeha.mountain);
                setUserRiver(user.pepeha.river);
                setUserWaka(user.pepeha.waka);
                setUserIwi(user.pepeha.iwi);
                setUserRole(user.pepeha.role);
        }
    }
        // console.log(pepehaObject);
    }, [user]);

    //get user participant role status and update variable with call back.
    // possibly this should be a Promise?
    Meteor.call("security.hasRole", Meteor.userId(), "PARTICIPANT_I", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        console.log("user is indigenous: ", result);
        setIsIndigenous(result);
    });

    //reference boolean to for the useEffect callback sending the changed pepeha list to the db
    const settingUserDetailsRef = useRef(false);
    //ensure the pepeha state variable is finished updating before sending to db. Modeled
    // on the comment reactions. Need to change so something more like a key:value is sent.
    useEffect(() => {
        if (settingUserDetailsRef.current) {
            console.log("sending details to db");

            settingUserDetailsRef.current = false;
            Meteor.call("security.updateUserDetails", userDetailsObject, Meteor.userId());
        }
    }, [userDetailsObject]);

    //reference boolean to for the useEffect callback sending the changed pepeha list to the db
    const settingPepehaRef = useRef(false);
    //ensure the pepeha state variable is finished updating before sending to db. Modeled
    // on the comment reactions. Need to change so something more like a key:value is sent.
    useEffect(() => {
        if (settingPepehaRef.current) {
            console.log("sending to db");

            settingPepehaRef.current = false;
            Meteor.call("security.updatePepeha", pepehaObject, Meteor.userId());
        }
    }, [pepehaObject]);


    const updateUserDetails = () => {
        setUserDetailsObject({firstName: userFirstName,
            lastName: userLastName, dob: userDoB, gender: userGender,
            religion: userReligion, ethnicity: userEthnicity, location: userLocation})
    }

    const updatePepeha = () => {
        setPepehaObject({mountain: userMountain, river: userRiver,
            waka: userWaka, iwi: userIwi, role: userRole})
    }

    const updateUsername = () => {
        Meteor.call("security.updateUsername", username, Meteor.userId());
    };

    // const updateName = () => {
    //     Meteor.call("security.updateName", name, Meteor.userId());
    // }
    //
    // const handleChangeName = () => {
    //     if(changeName){
    //         updateName();
    //     }
    //     setChangeName(!changeName);
    // }

    const updateUserPassword = () => {
        if (userNewPassword.length < 8) {
            setErr("Password must have at least 8 characters")
        } else {
            Accounts.changePassword(userOldPassword, userNewPassword);
            setChangeUserPassword(false);
        }
    }

    const handleUpdateUserDetails = () => {
        if (changeUserDetails){
            updateUserDetails();
            console.log("details managed");
        }
        setChangeUserDetails(!changeUserDetails);
    }

    const handleUpdatePepeha = () => {
        if (changeUserPepeha){
            updatePepeha();
            console.log("mischief managed");
        }
        setChangeUserPepeha(!changeUserPepeha);
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
                                    {/*    change username & stuff   */}

                                    <Input labelPosition="left"
                                           type="text"
                                           value={user && username}
                                           readOnly={!changeUsername}
                                           // size="mini"
                                           style={{width: "45%"}}
                                           onChange={({target}) => setUsername(target.value)}>
                                        <Label style={{width: "55%"}}>Username</Label>
                                        <input/>
                                        {!changeUsername ? (
                                            <Button type="button" size="mini" content="Change" onClick={() => {
                                                setChangeUsername(true)
                                            }}/>
                                        ) : (
                                            < Button type="button" size="mini" content="Save" onClick={() => {
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
                                            <Form.Button type="button" size="mini" content="Save" onClick={() => {
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
                                    <Divider/>
                                    <Card.Content header="User Details"/>
                                    {/*<br/>*/}
                                    {/*<Input value={user && name}*/}
                                    {/*       labelPosition="left"*/}
                                    {/*       type="text"*/}
                                    {/*       readOnly={!changeName}*/}
                                    {/*    // size="mini"*/}
                                    {/*       style={{width: "45%"}}*/}
                                    {/*       onChange={({target}) => setName(target.value)}>*/}
                                    {/*    <Label style={{width: "55%"}}>Name</Label>*/}
                                    {/*    <input/>*/}
                                    {/*    {!changeName ? (*/}
                                    {/*        <Button type="button" size="mini" content="Change" onClick={() => {*/}
                                    {/*            handleChangeName();*/}
                                    {/*        }}/>*/}
                                    {/*    ) : (*/}
                                    {/*        < Button type="button" size="mini" content="Save" onClick={() => {*/}
                                    {/*            handleChangeName();*/}
                                    {/*            // setChangeName(false);*/}
                                    {/*            // updateName();*/}
                                    {/*        }}/>*/}
                                    {/*    )}*/}
                                    {/*</Input>*/}
                                    {/*<br/>*/}
                                    <br/>
                                    <Input value={user && userFirstName}
                                           placeholder={"Enter First Name"}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserFirstName(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true}}
                                           onBlur={() => {handleUpdateUserDetails()}}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userLastName}
                                           placeholder={"Enter Last Name"}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserLastName(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true}}
                                           onBlur={() => {handleUpdateUserDetails()}}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userGender}
                                           placeholder={"Enter Gender"}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserGender(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true}}
                                           onBlur={() => {handleUpdateUserDetails()}}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userDoB}
                                           placeholder={"Enter Date of Birth"}
                                           type="date"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserDoB(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true}}
                                           onBlur={() => {handleUpdateUserDetails()}}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userEthnicity}
                                           placeholder={"Enter Ethnic Identity"}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserEthnicity(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true}}
                                           onBlur={() => {handleUpdateUserDetails()}}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userReligion}
                                           placeholder={"Enter Religion"}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserReligion(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true}}
                                           onBlur={() => {handleUpdateUserDetails()}}
                                    />
                                    <br/>
                                    <br/>
                                    <Input value={user && userLocation}
                                           placeholder={"Enter Location"}
                                           type="text"
                                           readOnly={!changeUserDetails}
                                           onChange={({target}) => setUserLocation(target.value)}
                                           onClick={() => {
                                               handleUpdateUserDetails()
                                               settingUserDetailsRef.current = true}}
                                           onBlur={() => {handleUpdateUserDetails()}}
                                    />
                                    <br/>
                                    <br/>
                                    {/*<Input value={user && userFirstName}*/}
                                    {/*       labelPosition="left"*/}
                                    {/*       type="text"*/}
                                    {/*       readOnly={!changeName}*/}
                                    {/*    // size="mini"*/}
                                    {/*       style={{width: "45%"}}*/}
                                    {/*       onChange={({target}) => setUserFirstName(target.value)}>*/}
                                    {/*    <Label style={{width: "55%"}}>First Name</Label>*/}
                                    {/*    <input/>*/}
                                    {/*    {!changeName ? (*/}
                                    {/*        <Button size="mini" content="Change" onClick={() => {*/}
                                    {/*            handleChangeName();*/}
                                    {/*        }}/>*/}
                                    {/*    ) : (*/}
                                    {/*        < Button size="mini" content="Save" onClick={() => {*/}
                                    {/*            handleChangeName();*/}
                                    {/*            // setChangeName(false);*/}
                                    {/*            // updateName();*/}
                                    {/*        }}/>*/}
                                    {/*    )}*/}
                                    {/*</Input>*/}
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
                        <Card as={Segment} fluid>
                            <Card.Content header="Pepeha"/>
                            <CardContent>
                                <Form>
                                    <Dropdown
                                        text={userMountain}
                                        value={userMountain}
                                        placeholder={'Select Mountain'}
                                        name="mountain"
                                        readOnly={!changeUserPepeha}
                                        lazyLoad
                                        // disabled={!changeUserPepeha}
                                        // loading={mountains.length === 0}
                                        allowAdditions
                                        selection
                                        search
                                        // fluid
                                        options={
                                            mountains &&
                                            mountains.map((mountain) => ({
                                                key: mountain._id,
                                                text: mountain.name,
                                                value: mountain.name,
                                            }))
                                        }
                                        onChange={(e, {value}) => {setUserMountain(value)}}
                                        onClick={() => {
                                            handleUpdatePepeha()
                                            settingPepehaRef.current = true}}
                                        onBlur={() => {handleUpdatePepeha()}}
                                    />
                                    {/*<Button icon style={{marginLeft: "20px"}}>*/}
                                    {/*    <Icon className="mountain"/>*/}
                                    {/*</Button>*/}
                                        {/*<Label style={{width: "55%"}}>Mountain</Label>*/}
                                    {/*</Form.Dropdown>*/}

                                    {/*<Input value={user && userMountain}*/}
                                    {/*       labelPosition="left"*/}
                                    {/*       type="text"*/}
                                    {/*       size="mini"*/}
                                    {/*       style={{width: "45%"}}*/}
                                    {/*       readOnly={!changeUserPepeha}*/}
                                    {/*       onChange={({target}) => setUserMountain(target.value)}*/}
                                    {/*       // onChange={handlePepehaSelect}*/}
                                    {/*>*/}
                                    {/*    <Label style={{width: "55%"}}>Mountain</Label>*/}
                                    {/*    <input/>*/}
                                        <Button type="button" icon style={{marginLeft: "20px"}}>
                                            <Icon className="mountain"/>
                                        </Button>
                                    {/*</Input>*/}
                                    <br/>
                                    <br/>
                                    <Input value={user && userRiver}
                                           placeholder={"Enter River"}
                                           // labelPosition="left"
                                           type="text"
                                           // size="mini"
                                           // style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserRiver(target.value)}
                                           onClick={() => {
                                               handleUpdatePepeha()
                                               settingPepehaRef.current = true}}
                                           onBlur={() => {handleUpdatePepeha()}}
                                           // onChange={handlePepehaSelect}
                                    >
                                        {/*<Label style={{width: "55%"}}>River</Label>*/}
                                        <input/>
                                        <Button type="button" icon style={{marginLeft: "20px"}}>
                                            <Icon className="river"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={user && userWaka}
                                           placeholder={"Enter Waka"}
                                           // labelPosition="left"
                                           type="text"
                                           // size="mini"
                                           // style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserWaka(target.value)}
                                           onClick={() => {
                                               handleUpdatePepeha()
                                               settingPepehaRef.current = true}}
                                           onBlur={() => {handleUpdatePepeha()}}
                                           // onChange={handlePepehaSelect}
                                        // onChange={() => {settingPepehaRef.current = true;
                                           //     setUserPepeha([...userPepeha, target.value])}}
                                    >
                                        {/*<Label style={{width: "55%"}}>Waka</Label>*/}
                                        <input/>
                                        <Button type="button" icon style={{marginLeft: "20px"}}>
                                            <Icon className="waka"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={user && userIwi}
                                           // labelPosition="left"
                                           placeholder={"Enter Iwi"}
                                           type="text"
                                           // size="mini"
                                           // style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserIwi(target.value)}
                                           // onChange={handlePepehaSelect}
                                            // onChange={({target}) => {settingPepehaRef.current = true;
                                           //     setUserPepeha([...userPepeha, target.value])}}
                                           onClick={() => {
                                               handleUpdatePepeha()
                                               settingPepehaRef.current = true}}
                                           onBlur={() => {handleUpdatePepeha()}}
                                    >
                                        {/*<Label style={{width: "55%"}}>Iwi</Label>*/}
                                        <input/>
                                        <Button type="button" icon style={{marginLeft: "20px"}}>
                                            <Icon className="iwi"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={user && userRole}
                                           placeholder={"Enter Employment or Role"}
                                           // labelPosition="left"
                                           type="text"
                                           // size="mini"
                                           // style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserRole(target.value)}
                                           // onChange={handlePepehaSelect}
                                            // onChange={({target}) => {settingPepehaRef.current = true;
                                           //     setUserPepeha([...userPepeha, target.value])}}
                                           onClick={() => {
                                               handleUpdatePepeha()
                                               settingPepehaRef.current = true}}
                                           onBlur={() => {handleUpdatePepeha()}}
                                    >
                                        {/*<Label style={{width: "55%"}}>Employment / Role</Label>*/}
                                        <input/>
                                        <Button type="button" icon style={{marginLeft: "20px"}}>
                                            <Icon className="role"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    {/*{!changeUserPepeha ?*/}
                                    {/*    <Button positive*/}
                                    {/*             fluid*/}
                                    {/*             onClick={() => {*/}
                                    {/*                 handleUpdatePepeha()*/}
                                    {/*                 settingPepehaRef.current = true}}*/}
                                    {/*             content={"Update Pepeha"}/>*/}
                                    {/*    :*/}
                                    {/*    <Button positive*/}
                                    {/*            fluid*/}
                                    {/*            onClick={() => {*/}
                                    {/*                handleUpdatePepeha();*/}
                                    {/*                // setChangeUserPepeha(false);*/}
                                    {/*                // updatePepeha();*/}
                                    {/*            }}*/}
                                    {/*            content={"Save Pepeha"}/>*/}
                                    {/*}*/}
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
