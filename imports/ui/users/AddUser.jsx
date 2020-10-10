import React, {useState} from "react";
import {Container, Segment, Form, Checkbox} from "semantic-ui-react";
import {NavBar} from "../navigation/NavBar";
import {useTracker} from "meteor/react-meteor-data";

export const AddUser = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userAnon, setUserAnon] = useState(false);
    const [errUsername, setErrUsername] = useState("");
    const [userRolesList, setUserRolesList] = useState(["PARTICIPANT_I"]);
    const userRoles = [
        'ADMIN',
        'GROUP_LEADER',
        'PARTICIPANT_I',
        'PARTICIPANT_W',
        'RESEARCHER'];

    const handleSubmit = () => {
        setErrUsername("");
        Meteor.call("security.addUser", userName, password, email, userAnon, userRolesList, (error, result) => {
            if (error) {
                setErrUsername(error.reason);
                return;
            } else {
                history.back();
                setErrUsername("");
            }});
    }

    return (
        <div>
            <NavBar/>
            <Container>
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
                         Please try again or choose to have one generated for you. This can be changed later</div>
                    ) : (
                        <div style={{ height: "10px" }} />
                    )}
                    <br/>
                    {Meteor.userId() &&
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
                    <Form.Button
                        content="Submit"
                        negative
                        disabled={email === ""}
                        onClick={() => {
                            // userName !== "" || userAnon &&
                            // // password !== "" &&
                            handleSubmit();
                        }
                        }
                    />
                </Form>
            </Container>
        </div>
    );
};
