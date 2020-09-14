import React, {useState} from "react";
import {Container, Segment, Form} from "semantic-ui-react";
import {NavBar} from "./NavBar";
import {useTracker} from "meteor/react-meteor-data";

export const AddUser = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [topicId, setTopicId] = useState("");
    // const [discussionTemplateId, setDiscussionTemplateId] = useState("");

    // const {topics, discussionTemplates} = useTracker(() => {
    //     Meteor.subscribe("topics");
    //     Meteor.subscribe("discussionTemplates");
    //
    //     return {
    //         topics: Topics.find().fetch(),
    //         discussionTemplates: DiscussionTemplates.find().fetch(),
    //     };
    // });

    return (
        <div>
            <NavBar/>
            <Container>
                <Form as={Segment} attached="bottom">
                    {/*input a list of emails. Space or comma separated*/}

                    <Form.Input
                        label="UserName"
                        type="text"
                        autoFocus
                        value={userName}
                        onInput={({target}) => setUserName(target.value)}
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
                            userName !== "" &&
                            password !== "" &&
                            Meteor.call("security.addUser", userName, password, email);
                            history.back();
                        }
                        }
                    />
                </Form>
            </Container>
        </div>
    );
};
