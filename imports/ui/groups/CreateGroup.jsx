import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
// import { NavBar } from "/imports/ui/navigation/NavBar";

export const CreateGroup = ({toggleModal}) => {
    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {users} = useTracker(() => {
        Meteor.subscribe("scenarioSets");

        return {
            users: Meteor.users.find().fetch(),
        };
    });

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
        >
            <Modal.Header>Create a Group</Modal.Header>
            <Modal.Content>
                <Form as={Segment} attached="bottom">
                    <Form.Input
                        label="Name"
                        type="text"
                        autoFocus
                        value={groupName}
                        onInput={({target}) => setGroupName(target.value)}
                    />
                    <Form.Field control={Form.Group} label="Members">
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
                            name="members"
                            value={members}
                            onChange={(e, {value}) => setMembers(value.concat())}
                        />
                    </Form.Field>
                    <Button
                        content="Save"
                        onClick={() => {
                            groupName !== "" &&
                            members.length > 1 &&
                            // scenarioSet !== "" &&
                            Meteor.call("groups.create", groupName, members);
                            toggleIt()
                            // history.back();
                        }
                        }
                    />
                    <Button color='black' onClick={toggleIt}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    );
};
