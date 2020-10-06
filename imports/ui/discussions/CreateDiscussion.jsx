import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
import {Topics} from "../../api/topics";
import {DiscussionTemplates} from "../../api/discussionTemplate";

export const CreateDiscussion = ({toggleModal}) => {
    // const [anonymous, setAnonymous] = useState(false);
    // const [typing, setTyping] = useState(false);
    const [discussionTitle, setDiscussionTitle] = useState("");
    // const [canEdit, setCanEdit] = useState(true);
    // const [isThreaded, setIsThreaded] = useState(false);
    // const [showProfile, setShowProfile] = useState(false);
    // const [canAddEmojis, setCanAddEmojis] = useState(false);
    const [timeLimit, setTimeLimit] = useState(0);
    // const [charLimit, setCharLimit] = useState(0);
    const [description, setDescription] = useState("");
    const [topicId, setTopicId] = useState("wyXdeAoBGGKXPaEh5");
    const [isOpen, setIsOpen] = useState(true);
    const [errTitle, setErrTitle] = useState("");

    const submitDiscussion = () => {
        const groupId = "nogroup";
        if (discussionTitle.length === 0) {
            setErrTitle("Discussions must have a title");
        } else {
            Meteor.call("scenarios.create", discussionTitle, description, topicId, discussionTemplate._id,
                (error, result) => {
                    Meteor.call("discussions.insert", result, groupId, timeLimit);
                })
            setDiscussionTitle("");
            toggleIt();
        }
    }

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {topics, discussionTemplate} = useTracker(() => {
        Meteor.subscribe("topics");
        Meteor.subscribe("discussionTemplates");

        //todo filter by user
        return {
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
                            // description: topic.description,
                            value: topic._id,
                        }))
                    }
                    name="topics"
                    value={topicId}
                    onChange={(e, {value}) => setTopicId(value)}
                />
                {/*<Checkbox disabled readOnly checked={anonymous} label='Users are anonymous' onClick={(e, data) => setAnonymous(data.checked)}/>*/}
                {/*<br/>*/}
                {/*<Checkbox disabled readOnly checked={typing} label='Show typing notifications'*/}
                {/*          onClick={(e, data) => setTyping(data.checked)}/>*/}
                {/*<br/>*/}
                {/*<Checkbox checked={canEdit} label='Users can edit their own comments'*/}
                {/*          onClick={(e, data) => setCanEdit(data.checked)}/>*/}
                {/*<br/>*/}
                {/*<Checkbox disabled readOnly checked={isThreaded} label='Comments are threaded'*/}
                {/*          onClick={(e, data) => setIsThreaded(data.checked)}/>*/}
                {/*<br/>*/}
                {/*<Checkbox disabled readOnly checked={showProfile} label='Show profile info (eg pic)'*/}
                {/*          onClick={(e, data) => setShowProfile(data.checked)}/>*/}
                {/*<br/>*/}
                {/*<br/>*/}
                {/*<Checkbox disabled readOnly checked={canAddEmojis} label='Users can add comment reactions'*/}
                {/*          onClick={(e, data) => setCanAddEmojis(data.checked)}/>*/}
                {/*<br/>*/}
                <br/>
                <Input style={{width: '60px', rightMargin: '60px'}} type='number' labelPosition='right'
                       value={timeLimit}
                       onInput={({target}) => setTimeLimit(target.value)}>
                    <Label>Discussion has a time limit</Label>
                    <input/>
                    <Label>mins</Label>
                </Input>
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
