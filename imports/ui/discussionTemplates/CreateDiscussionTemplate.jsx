import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";

export const CreateDiscussionTemplate = ({toggleModal}) => {
    const [anonymous, setAnonymous] = useState(false);
    const [typing, setTyping] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [canEdit, setCanEdit] = useState(true);
    const [isThreaded, setIsThreaded] = useState(false);
    const [isHui, setIsHui] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [canAddEmojis, setCanAddEmojis] = useState(false);
    const [timeLimit, setTimeLimit] = useState(0);
    const [charLimit, setCharLimit] = useState(0);
    const [isOpen, setIsOpen] = useState(true);
    const [errName, setErrName] = useState("");

    const submitTemplate = () => {
        if (templateName.length === 0) {
            setErrName("Templates must have a name");
        } else {
            setTemplateName("");
            Meteor.call("discussionTemplates.create", templateName, anonymous, typing, canEdit,
                isThreaded, showProfile, canAddEmojis, timeLimit, charLimit, isHui);
            toggleIt();
        }
    }

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    // enable form items as this functionality becomes available
    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            size="small"
        >
            <Modal.Header>Create A Discussion Template</Modal.Header>
            <Modal.Content>
            <Form >
                <Input
                    label="Template Name"
                    type="text"
                    placeholder="Template Name"
                    value={templateName}
                    onInput={({target}) => setTemplateName(target.value)}
                    autoFocus
                />
                {errName ? (
                    <div style={{height: "10px", color: "red", marginBottom:"10px"}}>{errName}</div>
                ) : (
                    <div style={{height: "10px", marginBottom:"10px"}}/>
                )}
                <br/>
                <br/>
                <Checkbox disabled readOnly checked={anonymous} label='Users are anonymous' onClick={(e, data) => setAnonymous(data.checked)}/>
                <br/>
                <Checkbox disabled readOnly checked={typing} label='Show typing notifications'
                          onClick={(e, data) => setTyping(data.checked)}/>
                <br/>
                <Checkbox checked={canEdit} label='Users can edit their own comments'
                          onClick={(e, data) => setCanEdit(data.checked)}/>
                <br/>
                <Checkbox disabled readOnly checked={isThreaded} label='Comments are threaded'
                          onClick={(e, data) => setIsThreaded(data.checked)}/>
                <br/>
                <Checkbox disabled readOnly checked={showProfile} label='Show profile info (eg pic)'
                          onClick={(e, data) => setShowProfile(data.checked)}/>
                <br/>
                <br/>
                <Checkbox disabled readOnly checked={canAddEmojis} label='Users can add comment reactions'
                          onClick={(e, data) => setCanAddEmojis(data.checked)}/>
                <br/>
                <br/>
                <Checkbox checked={isHui} label='Discussions use the Hui format'
                               onClick={(e, data) => setIsHui(data.checked)}/>
                <br/>
                <br/>
                <Input style={{width: '60px', rightMargin: '60px'}} type='number' labelPosition='right'
                       value={timeLimit}
                       onInput={({target}) => setTimeLimit(target.value)}>
                    <Label>Discussions have time limit</Label>
                    <input/>
                    <Label>mins</Label>
                </Input>
                <br/>
                <br/>
                <Input readOnly disabled style={{width: '60px', rightMargin: '70px'}} type='number' labelPosition='right'
                       value={charLimit}
                       onInput={({target}) => setCharLimit(target.value)}>
                    <Label>Comments have character limit</Label>
                    <input/>
                    <Label>characters</Label>
                </Input>
                <br/>
                <br/>

                <Modal.Actions>
                    <Button
                        content="Save"
                        onClick={() => {
                            submitTemplate();
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
