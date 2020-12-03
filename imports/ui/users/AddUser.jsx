import React, {useState} from "react";
import {Container, Segment, Form, Checkbox} from "semantic-ui-react";
import {NavBar} from "../navigation/NavBar";
import {useTracker} from "meteor/react-meteor-data";

export const AddUser = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignupComplete, setIsSignupComplete] = useState(false);
    const [userAnon, setUserAnon] = useState(false);
    const [errUsername, setErrUsername] = useState("");
    const [errEmail, setErrEmail] = useState("");
    const [userRolesList, setUserRolesList] = useState(["PARTICIPANT_I"]);
    const [isAdmin, setIsAdmin] = useState(false);
    const userRoles = [
        'ADMIN',
        'GROUP_LEADER',
        'PARTICIPANT_I',
        'PARTICIPANT_W',
        'RESEARCHER'];

    Meteor.call("security.hasRole", Meteor.userId(), "ADMIN", (error, result) => {
        if (error) {
            console.log(error.reason);
            return;
        }
        setIsAdmin(result);
    });

    const handleSubmit = () => {
        setErrEmail("");
        if(email.indexOf("@") === -1){
            setErrEmail("Please enter a valid email address.")
        } else {
            setErrUsername("");
            Meteor.call("security.addUser", userName, password, email, userAnon, userRolesList, (error, result) => {
                if (error) {
                    setErrUsername(error.reason + " ");
                    return;
                } else {
                    // history.back();
                    setIsSignupComplete(true);
                    setErrUsername("");
                }
            });
        }
    }

    return (
        <div>
            <NavBar/>
            <Container>
                {!isSignupComplete &&
                <Form as={Segment} attached="bottom">
                    {/*update to have ability to input a list of emails. Space or comma separated*/}
                    <Form.Input
                        label="User Name"
                        type="text"
                        autoFocus
                        value={userName}
                        onInput={({target}) => setUserName(target.value)}
                        disabled={userAnon}
                    />
                    <Checkbox label="Generate random username"
                                checked={userAnon}
                                disabled={userName !== ""}
                                readOnly={userName !== ""}
                                onClick={(e, data) => setUserAnon(data.checked)}
                    />
                    {errUsername ? (
                        <div style={{ height: "10px", color: "red" }}>{errUsername}
                          Please try again or choose to have one generated for you. This can be changed later.</div>
                    ) : (
                        <div style={{ height: "10px" }} />
                    )}
                    <br/>
                    {isAdmin &&
                    <Form.Dropdown
                        label="Which Roles do you want to assign?"
                        selection
                        multiple
                        options={userRoles && userRoles.map((role) => ({
                            key: role,
                            text: role[0] + role.substring(1,).toLowerCase(),
                            // description: role,
                            value: role,
                        }))}
                        name="roles"
                        value={userRolesList}
                        onChange={(e, {value}) => setUserRolesList(value.concat())}
                    />}
                    <Form.Input
                        label="Email"
                        type="email"
                        value={email}
                        onInput={({target}) => setEmail(target.value)}
                    />
                    {errEmail ? (
                        <div style={{ height: "10px", color: "red" }}>{errEmail}</div>
                    ) : (
                        <div style={{ height: "10px" }} />
                    )}
                    <br/>
                    <Form.Button
                        content="Submit"
                        negative
                        disabled={email === ""}
                        onClick={() => {
                            // userName !== "" || userAnon &&
                            // // password !== "" &&
                            handleSubmit();
                            setIsLoading(true)
                        }
                        }
                        loading={isLoading && !errUsername && !errEmail}
                    />
                </Form>}
                {isSignupComplete &&
                <Form as={Segment} attached="bottom">
                    <br/>
                    <h3>Please check your emails for an invitation and validate you email address using the link provided</h3>
                    <Form.Button
                        content="Return"
                        positive
                        onClick={() => {
                            history.back();
                            }
                        }
                    />
                </Form>}
            </Container>
        </div>
    );
};
