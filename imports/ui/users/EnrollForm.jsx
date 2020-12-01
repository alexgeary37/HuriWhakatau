import React, {useState} from "react";
import {Container, Segment, Form} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router-dom";
import {Accounts} from "meteor/accounts-base";

export const EnrollForm = () => {
    const {token, invitingUser} = useParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [errPassword, setErrPassword] = useState("");
    let history = useHistory();
    console.log("user who invited = ", invitingUser)

    const handleFormSubmit = () => {
        if (password.length < 8) {
            setErrPassword("Passwords must have at least 8 characters");
            return;
        } else {
            if(invitingUser) {
            Meteor.call("users.findInvitedFriendId", token, (err, result) => {
                if (result) {
                    console.log("friend found: ", result);
                    Meteor.call("users.addFriend", invitingUser, result._id);
                    Meteor.call("users.addFriend", result._id, invitingUser);
                    Accounts.resetPassword(token, password, () => {
                            history.push("/mydashboard")
                            console.log("passwordset")
                        }
                    );
                    Accounts.verifyEmail(token);
                } else {
                    console.error(err);
                }
            });

        } else {
                Accounts.resetPassword(token, password, () => {
                        history.push("/mydashboard");
                        console.log("passwordset");
                    }
                );
            Accounts.verifyEmail(token);
        }


        }
    }

    return (
        <div>
            <NavBar/>
            <Container>
                <Form as={Segment} attached="bottom">
                    <p>Please enter a password to continue. After submitting you will be redirected to your dashboard
                    where the discussions you are to participate in will be listed.</p>
                    <Form.Input
                        focus
                        label="Password"
                        type="Password"
                        value={password}
                        onInput={({target}) => setPassword(target.value)}
                    />
                    {errPassword ? (
                        <div style={{height: "10px", color: "red"}}>{errPassword}</div>
                    ) : (
                        <div style={{height: "10px"}}/>
                    )}
                    <Form.Input
                        label="Confirm Password"
                        type="Password"
                        error={password !== confirm}
                        value={confirm}
                        onInput={({target}) => setConfirm(target.value)}
                    />
                    <Form.Button
                        content="Submit"
                        onClick={() => {
                            handleFormSubmit()
                        }
                        }
                    />
                </Form>
            </Container>
        </div>
    );
};
