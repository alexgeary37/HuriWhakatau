import React, {useEffect, useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button, Header} from "semantic-ui-react";

export const ViewGroup = ({toggleModal, group}) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {members} = useTracker(() => {
        Meteor.subscribe("users");

        return {
            members: Meteor.users.find({_id: {$in: group.members}}).fetch(),
        };
    });

    const leaveGroup = () => {
        Meteor.call("groups.removeMember", group._id, Meteor.userId());
    }

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
            closeOnDimmerClick={false}
        >
            <Modal.Header>Group: {group.name}</Modal.Header>

            <Modal.Content>
                <Header as={'h5'} content={'Group Members: '}/>
                {members && members.map((member) => (
                    <p key={member._id}>{member.username}<span>{member._id === Meteor.userId() &&
                    <span>(you)</span>}</span></p>
                ))}
            </Modal.Content>
            <Modal.Actions>
                {members && members.map((member) => (
                    <span>{member._id === Meteor.userId() &&
                    <Button style={{marginRight: '15px'}} content={'Remove yourself from group'} onClick={leaveGroup}/>}</span>
                ))}
                <Button content={'Close'} onClick={toggleIt}/>
            </Modal.Actions>
        </Modal>
    )
}
