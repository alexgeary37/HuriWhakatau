import React, {useState} from "react";
import {Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";

export const DisplayDiscussionTemplate = ({toggleModal, template}) => {
    const anonymous = template.usersAreAnonymous;
    const typing = template.showTypingNotification;
    const templateName = template.name;
    const canEdit = template.usersCanEditComments;
    const isThreaded = template.discussionCommentsThreaded;
    const showProfile = template.showProfileInfo;
    const canAddEmojis = template.canAddEmojis;
    const timeLimit = template.timeLimit;
    const charLimit = template.commentCharacterLimit;

    const toggleIt = () => {
        toggleModal();
    }

    // enable form items as this functionality becomes available
    return (
        <Modal
            open={true}
            size="small"
            closeOnDimmerClick={false}
        >
            <Modal.Header>Discussion Template</Modal.Header>
            <Modal.Content>
                <Input
                    label="Template Name"
                    type="text"
                    placeholder="Template Name"
                    value={templateName}
                    autoFocus
                />
                <br/>
                <br/>
                <Checkbox disabled readOnly checked={anonymous} label='Users are anonymous'/>
                <br/>
                <Checkbox disabled readOnly checked={typing} label='Show typing notifications'/>
                <br/>
                <Checkbox checked={canEdit} label='Users can edit their own comments'/>
                <br/>
                <Checkbox disabled readOnly checked={isThreaded} label='Comments are threaded'/>
                <br/>
                <Checkbox disabled readOnly checked={showProfile} label='Show profile info (eg pic)'/>
                <br/>
                <br/>
                <Checkbox disabled readOnly checked={canAddEmojis} label='Users can add comment reactions'/>
                <br/>
                <br/>
                <Input style={{width: '60px', rightMargin: '60px'}} type='number' labelPosition='right'
                       value={timeLimit}
                >
                    <Label>Discussions have time limit</Label>
                    <input/>
                    <Label>mins</Label>
                </Input>
                <br/>
                <br/>
                <Input readOnly disabled style={{width: '60px', rightMargin: '70px'}} type='number'
                       labelPosition='right'
                       value={charLimit}
                >
                    <Label>Comments have character limit</Label>
                    <input/>
                    <Label>characters</Label>
                </Input>
                <br/>
                <br/>
            </Modal.Content>
            <Modal.Actions>
                {/* todo make this button save a new template if any value changed, prompt for new template name */}
                {/*<Button*/}
                {/*    content="Save"*/}
                {/*    onClick={() =>*/}
                {/*    // {*/}
                {/*        // submitTemplate();*/}
                {/*        // }*/}
                {/*        toggleIt*/}
                {/*    }*/}
                {/*    positive*/}
                {/*/>*/}
                <Button color='black' onClick={toggleIt}>
                    Close
                </Button>
            </Modal.Actions>
        </Modal>
    );
};
