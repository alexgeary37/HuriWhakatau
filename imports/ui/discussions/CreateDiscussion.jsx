import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
import {Topics} from "../../api/topics";
import {Groups} from "../../api/groups";
import {DiscussionTemplates} from "../../api/discussionTemplate";

export const CreateDiscussion = ({toggleModal}) => {
    const [discussionTitle, setDiscussionTitle] = useState("");
    const [timeLimit, setTimeLimit] = useState(0);
    const [description, setDescription] = useState("");
    const [topicId, setTopicId] = useState("wyXdeAoBGGKXPaEh5");
    const [groupId, setGroupId] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [isHui, setIsHui] = useState(false);
    const [errTitle, setErrTitle] = useState("");
    const [createNewGroup, setCreateNewGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [errGroupName, setErrGroupName] = useState("");

    const submitDiscussion = () => {
        if (groupName.length === 0 && createNewGroup) {
            setErrGroupName("Groups must have a name");
        } else {
            setErrGroupName("");
        }

        if (discussionTitle.length === 0) {
            setErrTitle("Discussions must have a title");
        } else {
            setDiscussionTitle("");
        }
        //add in the isOpen flag
        if(discussionTitle.length !== 0 && (groupName.length !== 0 || groupId.length !== 0)){
            Meteor.call("scenarios.create", discussionTitle, description, topicId, discussionTemplate._id,
                (error, result) => {
                    Meteor.call("discussions.insert", result, groupId, timeLimit, isHui);
                })
            toggleIt();
        }
    }

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {groups, topics, discussionTemplate} = useTracker(() => {
        Meteor.subscribe("groups");
        Meteor.subscribe("topics");
        Meteor.subscribe("discussionTemplates");

        //todo filter by user
        return {
            groups: Groups.find({members: {$elemMatch: {$eq: Meteor.userId()}}}).fetch(),
            topics: Topics.find().fetch(),
            discussionTemplate: DiscussionTemplates.findOne({name: "Default - Users Can Edit Comments"}),
        };
    });

    // enable form items as this functionality becomes available
    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
        >
            <Modal.Header>Create A Discussion</Modal.Header>
            <Modal.Content>
            <Form >
                <Input
                    label="Discussion Title"
                    type="text"
                    placeholder="Discussion Title"
                    value={discussionTitle}
                    onInput={({target}) => setDiscussionTitle(target.value)}
                    autoFocus
                />
                {errTitle ? (
                    <div style={{height: "10px", color: "red", marginBottom:"10px"}}>{errTitle}</div>
                ) : (
                    <div style={{height: "10px", marginBottom:"10px"}}/>
                )}
                <Input
                    label="Discussion Description"
                    type="text"
                    placeholder="Discussion Description"
                    value={description}
                    onInput={({target}) => setDescription(target.value)}
                />
                <br/>
                <br/>
                <Form.Dropdown
                    label="Topic"
                    loading={topics.length === 0}
                    selection
                    search
                    options={
                        topics &&
                        topics.map((topic) => ({
                            key: topic._id,
                            text: topic.title,
                            value: topic._id,
                        }))
                    }
                    name="topics"
                    value={topicId}
                    onChange={(e, {value}) => setTopicId(value)}
                />
                <br/>
                <Form.Dropdown
                    label={"Group"}
                    loading={groups.length === 0}
                    selection
                    search
                    options={
                        groups &&
                        groups.map((group) => ({
                            key: group._id,
                            text: group.name,
                            value: group._id,
                        }))
                    }
                    name="groups"
                    value={groupId}
                    onChange={(e, {value}) => setGroupId(value)}
                    />
                <Checkbox disabled readOnly checked={createNewGroup} label='Create new group?'
                          onClick={(e, data) => setCreateNewGroup(data.checked)}/>
                <br/>
                <br/>
                {createNewGroup && <div><Input
                    label="Group name"
                    type="text"
                    placeholder="Group Name"
                    value={groupName}
                    onInput={({target}) => setGroupName(target.value)}
                    autoFocus={createNewGroup}
                    disabled readOnly
                />
                {errGroupName ? (
                    <div style={{height: "10px", color: "red", marginBottom:"10px"}}>{errGroupName}</div>
                    ) : (
                    <div style={{height: "10px", marginBottom:"10px"}}/>
                    )}</div>}
                <Input style={{width: '60px', rightMargin: '60px'}} type='number' labelPosition='right'
                       value={timeLimit}
                       onInput={({target}) => setTimeLimit(target.value)}>
                    <Label>Discussion has a time limit</Label>
                    <input/>
                    <Label>mins</Label>
                </Input>
                <br/>
                <br/>
                <Checkbox checked={isHui} label='Discussions use the Hui format'
                          onClick={(e, data) => setIsHui(data.checked)}/>
                <br/>
                <br/>
                <Modal.Actions>
                    <Button
                        content="Save"
                        onClick={() => {
                            submitDiscussion();
                            }
                        }
                        positive
                    />
                    <Button color='black' onClick={toggleIt}>
                        Cancel
                    </Button>
                </Modal.Actions>
            </Form>
            </Modal.Content>
        </Modal>
    );
};
