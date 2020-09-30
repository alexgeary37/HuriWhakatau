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

    console.log("mount", mountains[0]);
    const [changeUserPassword, setChangeUserPassword] = useState(false);
    const [userNewPassword, setUserNewPassword] = useState("");
    const [userOldPassword, setUserOldPassword] = useState("");
    const [changeUsername, setChangeUsername] = useState(false);
    const [changeName, setChangeName] = useState(false);
    const [isIndigenous, setIsIndigenous] = useState(false);
    const [userMountain, setUserMountain] = useState("");
    const [changeUserPepeha, setChangeUserPepeha] = useState(false);
    const [pepehaObject, setPepehaObject] =
        useState({mountain:"",
                            river:"",
                            waka:"",
                            iwi:"",
                            role:""});
    const [userRiver, setUserRiver] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userWaka, setUserWaka] = useState("");
    const [username, setUsername] = useState("");
    const [userIwi, setUserIwi] = useState("");
    const [name, setName] = useState("");
    const [err, setErr] = useState("");
    useEffect(() => {
        if (user && isIndigenous && !changeUserPepeha && !changeName && !changeUsername) {
            console.log("Adding info to states");
            setUsername(user.username);
            if(user.name){
                setName(user.name);
            }
            if (user.pepeha) {
                setUserMountain(user.pepeha.mountain);
                setUserRiver(user.pepeha.river);
                setUserWaka(user.pepeha.waka);
                setUserIwi(user.pepeha.iwi);
                setUserRole(user.pepeha.role);
        }
    }
        console.log(pepehaObject);
    }, [user]);

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

    const updatePepeha = () => {
        setPepehaObject({mountain: userMountain, river: userRiver, waka: userWaka, iwi: userIwi, role: userRole})
    }

    const updateUsername = () => {
        Meteor.call("security.updateUsername", username, Meteor.userId());
    };

    const updateName = () => {
        Meteor.call("security.updateName", name, Meteor.userId());
    }

    const handleChangeName = () => {
        if(changeName){
            updateName();
        }
        setChangeName(!changeName);
    }

    const updateUserPassword = () => {
        if (userNewPassword.length < 8) {
            setErr("Password must have at least 8 characters")
        } else {
            Accounts.changePassword(userOldPassword, userNewPassword);
            setChangeUserPassword(false);
        }
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
                                    {/*    change username stuff   */}
                                    <Input value={user && name}
                                           labelPosition="left"
                                           type="text"
                                           readOnly={!changeName}
                                           size="mini"
                                           style={{width: "45%"}}
                                           onChange={({target}) => setName(target.value)}>
                                    <Label style={{width: "55%"}}>Name</Label>
                                        <input/>
                                        {!changeName ? (
                                            <Button size="mini" content="Change" onClick={() => {
                                                handleChangeName();
                                            }}/>
                                        ) : (
                                            < Button size="mini" content="Save" onClick={() => {
                                                handleChangeName();
                                                // setChangeName(false);
                                                // updateName();
                                            }}/>
                                        )}
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input labelPosition="left"
                                           type="text"
                                           value={user && username}
                                           readOnly={!changeUsername}
                                           size="mini"
                                           style={{width: "45%"}}
                                           onChange={({target}) => setUsername(target.value)}>
                                        <Label style={{width: "55%"}}>Username</Label>
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
                                           onChange={({target}) => setUserOldPassword(target.value)}>
                                        <Label style={{width: "55%"}}>Password</Label>
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
                                                    error={userNewPassword.length < 8}
                                                    size="mini"
                                                    style={{width: "45%"}}
                                                    onChange={({target}) => setUserNewPassword(target.value)}>
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
                        <Card as={Segment} fluid>
                            <Card.Content header="Pepeha"/>
                            <CardContent>
                                <Form>
                                    <Form.Dropdown
                                        // labelPosition="left"
                                        size="mini"
                                        style={{width: "60%"}}
                                        text={userMountain}
                                        placeholder={userMountain.length === 0 && 'Select Mountain'}
                                        labeled
                                        lazyLoad
                                        readOnly={!changeUserPepeha}
                                        disabled={!changeUserPepeha}
                                        loading={mountains.length === 0}
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
                                        name="mountain"
                                        value={userMountain}
                                        onChange={(e, {value}) => setUserMountain(value)}
                                    />
                                        {/*<Label style={{width: "55%"}}>Mountain</Label>*/}
                                    {/*</Form.Dropdown>*/}
                                    <Input value={user && userMountain}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserMountain(target.value)}
                                           // onChange={handlePepehaSelect}
                                    >
                                        <Label style={{width: "55%"}}>Mountain</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="mountain"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={user && userRiver}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserRiver(target.value)}
                                           // onChange={handlePepehaSelect}
                                    >
                                        <Label style={{width: "55%"}}>River</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="river"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={user && userWaka}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserWaka(target.value)}
                                           // onChange={handlePepehaSelect}
                                        // onChange={() => {settingPepehaRef.current = true;
                                           //     setUserPepeha([...userPepeha, target.value])}}
                                    >
                                        <Label style={{width: "55%"}}>Waka</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="waka"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={user && userIwi}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserIwi(target.value)}
                                           // onChange={handlePepehaSelect}
                                            // onChange={({target}) => {settingPepehaRef.current = true;
                                           //     setUserPepeha([...userPepeha, target.value])}}
                                    >
                                        <Label style={{width: "55%"}}>Iwi</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="iwi"/>
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={user && userRole}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width: "45%"}}
                                           readOnly={!changeUserPepeha}
                                           onChange={({target}) => setUserRole(target.value)}
                                           // onChange={handlePepehaSelect}
                                            // onChange={({target}) => {settingPepehaRef.current = true;
                                           //     setUserPepeha([...userPepeha, target.value])}}
                                    >
                                        <Label style={{width: "55%"}}>Employment / Role</Label>
                                        <input/>
                                        <Button icon style={{marginLeft: "20px"}}>
                                            <Icon className="role"/>
                                        </Button>
                                    </Input>
                                    {!changeUserPepeha ?
                                        <Button positive
                                                 fluid
                                                 onClick={() => {
                                                     handleUpdatePepeha()
                                                     settingPepehaRef.current = true}}
                                                 content={"Update Pepeha"}/>
                                        :
                                        <Button positive
                                                fluid
                                                onClick={() => {
                                                    handleUpdatePepeha();
                                                    // setChangeUserPepeha(false);
                                                    // updatePepeha();
                                                }}
                                                content={"Save Pepeha"}/>
                                    }
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
