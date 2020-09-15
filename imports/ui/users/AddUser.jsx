import React, {useState} from "react";
import {Container, Segment, Form, Checkbox} from "semantic-ui-react";
import {NavBar} from "../navigation/NavBar";

export const AddUser = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userAnon, setUserAnon] = useState(false);


    return (
        <div>
            <NavBar/>
            <Container>
                <Form as={Segment} attached="bottom">
                    {/*update to have ability to input a list of emails. Space or comma separated*/}

                    <Form.Input
                        label="UserName"
                        type="text"
                        autoFocus
                        value={userName}
                        onInput={({target}) => setUserName(target.value)}
                    />
                    <Checkbox label="Generate random username"
                              checked={userAnon}
                              onClick={(e, data) => setUserAnon(data.checked)}
                              />
                    <Form.Input
                        label="Password"
                        type="text"
                        value={password}
                        onInput={({target}) => setPassword(target.value)}
                    />
                    <Form.Input
                        label="Email"
                        type="email"
                        value={email}
                        onInput={({target}) => setEmail(target.value)}
                    />
                    <Form.Button
                        content="Submit"
                        onClick={() => {
                            userName !== "" || userAnon &&
                            // password !== "" &&
                            Meteor.call("security.addUser", userName, password, email, userAnon);
                            history.back();
                        }
                        }
                    />
                </Form>
            </Container>
        </div>
    );
};
