import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Segment, Form, Modal, Button} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {Meteor} from "meteor/meteor";

export const AssignRoles = ({toggleModal}) => {
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [roleListErr, setRoleListErr] = useState("");
    const [userListErr, setUserListErr] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    };

    const handleSubmit = () => {
        setRoleListErr("");
        setUserListErr("");
        if (roleList.length === 0) {
            setRoleListErr("You must select at least one role");
        }
        if (userList.length === 0) {
            setUserListErr("You must select at least one user")
        }
        console.log("about to update roles", userList, roleList)

        if (userList.length > 0 && roleList.length > 0) {
            console.log("Updating roles", userList, roleList)
            Meteor.call("security.setRoles", userList, roleList, (err, result) => {
                if (err) {
                    console.log("error updating roles")
                    setErrorMsg("Something went wrong, roles may not have updated")
                } else {
                    console.log("everything is fine")
                    setUserList([]);
                    setRoleList([]);
                    setSuccessMsg("Roles updated successfully")
                }
            });
        }
    }

    const {users, roles} = useTracker(() => {

        const userRoles = [
            'ADMIN',
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
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            closeOnDimmerClick={false}
            size="small"
        >
            <Modal.Header
                className={'userRoles'}>Assign user roles</Modal.Header>
            <Modal.Content>
                <Form as={Segment} attached="bottom">
                    <Form.Dropdown
                        label="Which Roles do you want to assign?"
                        selection
                        multiple
                        options={roles && roles.map((role) => ({
                            key: role,
                            text: role.toLowerCase(),
                            value: role,
                        }))}
                        name="roles"
                        value={roleList}
                        onChange={(e, {value}) => setRoleList(value.concat())}
                    />
                    {roleListErr ? (
                        <div style={{
                            height: "10px",
                            marginTop: "-13px",
                            marginBottom: "10px",
                            color: "red"
                        }}>{roleListErr}</div>
                    ) : (
                        <div style={{height: "10px", marginTop: "-13px", marginBottom: "10px"}}/>
                    )}
                    <Form.Field control={Form.Group} label="Select users">
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
                    {userListErr ? (
                        <div style={{
                            height: "10px",
                            marginTop: "-13px",
                            marginBottom: "10px",
                            color: "red"
                        }}>{userListErr}</div>
                    ) : (
                        <div style={{height: "10px", marginTop: "-13px", marginBottom: "10px"}}/>
                    )}
                    <Modal.Actions>
                        <Button
                            content="Submit"
                            positive
                            onClick={handleSubmit}
                        />
                        <Button
                            color='black'
                            content={'Cancel'}
                            onClick={toggleIt}/>
                        {successMsg &&
                        <div style={{height: "10px", color: "blue"}}>{successMsg}</div>
                        }
                        {errorMsg &&
                        <div style={{height: "10px", color: "red"}}>{errorMsg}</div>
                        }
                        {!successMsg && !errorMsg &&
                        <div style={{height: "10px"}}/>
                        }
                    </Modal.Actions>
                </Form>
            </Modal.Content>
        </Modal>
    );
};
