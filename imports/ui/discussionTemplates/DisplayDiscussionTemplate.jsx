import React, {useState} from "react";
import {Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";

export const DisplayDiscussionTemplate = ({toggleModal, template}) => {
    // console.log(isCreationOpen.isCreationOpen);
    const anonymous = template.usersAreAnonymous;
    const typing = template.showTypingNotification;
    const templateName = template.name;
    const canEdit = template.usersCanEditComments;
    const isThreaded = template.discussionCommentsThreaded;
    const showProfile = template.showProfileInfo;
    const canAddEmojis = template.canAddEmojis;
    const timeLimit = template.timeLimit;
    const charLimit = template.commentCharacterLimit;
    const [isOpen, setIsOpen] = useState(true);

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
                    // onInput={({target}) => setTemplateName(target.value)}
                    autoFocus
                />
                <br/>
                <br/>
                <Checkbox disabled readOnly checked={anonymous} label='Users are anonymous'
                          // onClick={(e, data) => setAnonymous(data.checked)}
                />
                <br/>
                <Checkbox disabled readOnly checked={typing} label='Show typing notifications'
                          // onClick={(e, data) => setTyping(data.checked)}
                />
                <br/>
                <Checkbox checked={canEdit} label='Users can edit their own comments'
                          // onClick={(e, data) => setCanEdit(data.checked)}
                />
                <br/>
                <Checkbox disabled readOnly checked={isThreaded} label='Comments are threaded'
                          // onClick={(e, data) => setIsThreaded(data.checked)}
                />
                <br/>
                <Checkbox disabled readOnly checked={showProfile} label='Show profile info (eg pic)'
                          // onClick={(e, data) => setShowProfile(data.checked)}
                />
                <br/>
                <br/>
                <Checkbox disabled readOnly checked={canAddEmojis} label='Users can add comment reactions'
                          // onClick={(e, data) => setCanAddEmojis(data.checked)}
                />
                <br/>
                <br/>
                <Input style={{width: '60px', rightMargin: '60px'}} type='number' labelPosition='right'
                       value={timeLimit}
                       // onInput={({target}) => setTimeLimit(target.value)}
                >
                    <Label>Discussions have time limit</Label>
                    <input/>
                    <Label>mins</Label>
                </Input>
                <br/>
                <br/>
                <Input readOnly disabled style={{width: '60px', rightMargin: '70px'}} type='number' labelPosition='right'
                       value={charLimit}
                       // onInput={({target}) => setCharLimit(target.value)}
                >
                    <Label>Comments have character limit</Label>
                    <input/>
                    <Label>characters</Label>
                </Input>
                <br/>
                <br/>

                <Modal.Actions>
                    <Button
                        content="Save"
                        onClick={() =>
                        // {
                            // submitTemplate();
                            // }
                            toggleIt
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
