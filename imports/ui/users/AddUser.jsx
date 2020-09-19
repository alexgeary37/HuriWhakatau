import React, {useState} from "react";
import {Container, Segment, Form, Checkbox} from "semantic-ui-react";
import {NavBar} from "../navigation/NavBar";

export const AddUser = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userAnon, setUserAnon] = useState(false);
    const [userRolesList, setUserRolesList] = useState([]);
    const userRoles = [
        'ADMIN',
        // 'CREATE_GROUPS',
        // 'CREATE_SCENARIOS',
        // 'CREATE_SCENARIOSETS',
        'GROUP_LEADER',
        'PARTICIPANT_I',
        'PARTICIPANT_W',
        'RESEARCHER'];

    // const [submitDisabled, setSubmitDisabled] = useState(true);
    // covering every situation where we want the form submit to be enabled or disabled and setting appropriately.
    // There has to be a simpler way. and probably needs to use a hook, so get on that will you?
//     const handleStatechange = () => {
//         if( (email === "" && userAnon === true && userName === "") ||
//             (email === "" && userAnon === true && userName !== "") ||
//             (email === "" && userAnon !== true && userName === "") ||
//             (email !== "" && userAnon !== true && userName === "") ||
//             (email === "" && userAnon !== true && userName !== "")) {
//             setSubmitDisabled(true);
//         } else
//         if( (email !== "" && userAnon === true && userName === "") ||
//             (email !== "" && userAnon !== true && userName === "") ||
//             (email !== "" && userAnon === true && userName !== "") ){
//             setSubmitDisabled(false);
//         }
// };

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
                    />
                    {/*<Form.Input*/}
                    {/*    label="Password"*/}
                    {/*    type="text"*/}
                    {/*    value={password}*/}
                    {/*    onInput={({target}) => setPassword(target.value)}*/}
                    {/*/>*/}
                    <Form.Input
                        label="Email"
                        type="email"
                        value={email}
                        onInput={({target}) => setEmail(target.value)}
                    />
                    <Form.Button
                        content="Submit"
                        disabled={email === ""}
                        onClick={() => {
                            // userName !== "" || userAnon &&
                            // // password !== "" &&
                            Meteor.call("security.addUser", userName, password, email, userAnon, userRolesList);
                            history.back();
                        }
                        }
                    />
                </Form>
            </Container>
        </div>
    );
};
//(!(userName !== "")) ||
