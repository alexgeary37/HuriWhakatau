import React, {useState} from "react";
import {Container, Segment, Form} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router-dom";
import {Accounts} from "meteor/accounts-base";

export const EnrollForm = () => {
    const {token} = useParams();
    console.log(token);
    // const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    let history = useHistory();

    return (
        <div>
            <NavBar/>
            <Container>
                <Form as={Segment} attached="bottom">
                    <p>Please enter a password to continue. After submitting you will be redirected to your dashboard
                    where the discussions you are to participate in will be listed.</p>
                    <Form.Input
                        label="Password"
                        type="Password"
                        value={password}
                        onInput={({target}) => setPassword(target.value)}
                    />
                    <Form.Input
                        label="Password"
                        type="Password"
                        error={password !== confirm}
                        value={confirm}
                        onInput={({target}) => setConfirm(target.value)}
                    />
                    <Form.Button
                        content="Submit"
                        onClick={() => {
                            // userName !== "" &&
                            password !== "" &&
                            Accounts.resetPassword(token, password, () =>
                                history.push("/mydashboard")
                            );
                            Accounts.verifyEmail(token);
                        }
                        }
                    />
                </Form>
            </Container>
        </div>
    );
};
