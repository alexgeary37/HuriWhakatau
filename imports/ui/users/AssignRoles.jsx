import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {Roles} from "meteor/alanning:roles";
import {Meteor} from "meteor/meteor";

export const AssignRoles = () => {
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);

    const {users, roles} = useTracker(() => {

        const userRoles = [
            'ADMIN',
            // 'CREATE_GROUPS',
            // 'CREATE_SCENARIOS',
            // 'CREATE_SCENARIOSETS',
            'GROUP_LEADER',
            'PARTICIPANT_I',
            'PARTICIPANT_W',
            'RESEARCHER'];

        //trying to dynamically get roles but it didn't work. static list it is.
        // Meteor.subscribe("roles");
        // let userRoles = [];
        // let fetchedRoles = Roles.getAllRoles();
        // // let fetchedRoles = Meteor.roles.find({});
        // console.log("roles: ", fetchedRoles);
        // fetchedRoles.forEach((role) => {
        //     userRoles.push(role._id);
        // });
        // console.log(userRoles);
        return {
            users: Meteor.users.find().fetch(),
            roles: userRoles,
        };
    });

    return (
        <div>
            <NavBar/>
            <Container>
                <Form as={Segment} attached="bottom">
                    <Form.Dropdown
                        label="Which Roles do you want to assign?"
                        selection
                        multiple
                        options={roles && roles.map((role) => ({
                            key: role,
                            text: role.toLowerCase(),
                            // description: role,
                            value: role,
                        }))}
                        name="roles"
                        value={roleList}
                        onChange={(e, {value}) => setRoleList(value.concat())}
                    />
                    <Form.Field control={Form.Group} label="userList">
                        <Form.Dropdown
                            width={14}
                            loading={users.length === 0}
                            selection
                            multiple
                            search
                            options={
                                users &&
                                users.map((user) => ({
                                    key: user._id,
                                    text: user.username,
                                    value: user._id,
                                }))
                            }
                            name="userList"
                            value={userList}
                            onChange={(e, {value}) => setUserList(value.concat())}
                        />
                    </Form.Field>
                    <Form.Button
                        content="Submit"
                        onClick={() => {
                            roleList.length > 0 &&
                            userList.length > 0 &&
                            Meteor.call("security.setRoles", userList, roleList);
                            history.back();
                        }}
                    />
                </Form>
            </Container>
        </div>
    );
};
