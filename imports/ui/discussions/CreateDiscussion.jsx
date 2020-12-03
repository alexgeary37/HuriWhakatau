import React, {useEffect, useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Container, Segment, Form, Checkbox, Input, Label, Modal, Button} from "semantic-ui-react";
import {Categories} from "../../api/categories";
import {Tour} from "../navigation/Tour";
import {Groups} from "../../api/groups";
import {DiscussionTemplates} from "../../api/discussionTemplate";

export const CreateDiscussion = ({toggleModal}) => {
    const [discussionTitle, setDiscussionTitle] = useState("");
    const [timeLimit, setTimeLimit] = useState(0);
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [groupId, setGroupId] = useState("");
    const [isOpen, setIsOpen] = useState(true);
    const [isHui, setIsHui] = useState(false);
    const [errTitle, setErrTitle] = useState("");
    const [createNewGroup, setCreateNewGroup] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [errGroupName, setErrGroupName] = useState("");
    const createDiscussionTour = [
        {
            target: ".newDiscussion1",
            content: "Give your discussion a title like 'Should Badgers be welcomed into polite Rabbit society?'" +
                " and a description giving more detail"
        },
    ];

    const submitDiscussion = () => {
        if (groupName.length === 0 && createNewGroup) {
            setErrGroupName("Groups must have a name");
        }

        if (discussionTitle.length === 0) {
            setErrTitle("Discussions must have a title");
        }

        //add in the isOpen flag
        if (discussionTitle.length !== 0 && (groupName.length !== 0 || groupId.length !== 0)) {
            let newGroupId;
            if (groupId.length === 0 && groupName.length !== 0) {
                Meteor.call("groups.create", groupName, [Meteor.userId()], (err, result) => {
                    insertDiscussion(result);
                });
            } else {
                insertDiscussion(newGroupId);
            }
            toggleIt();
        }
    }

    const insertDiscussion = (newGroupId) => {
        Meteor.call("scenarios.create", discussionTitle, description, categoryId, discussionTemplate._id,
            (error, result) => {
                Meteor.call("discussions.insert", result, groupId.length !== 0 ? groupId : newGroupId, Number(timeLimit), isHui, true);
            })
    }

    const toggleIt = () => {
        setIsOpen(false);
        toggleModal();
    }

    const {groups, categories, discussionTemplate} = useTracker(() => {
        Meteor.subscribe("groups");
        Meteor.subscribe("topics");
        Meteor.subscribe("categories");
        Meteor.subscribe("discussionTemplates");

        //todo filter by user
        return {
            groups: Groups.find({members: {$elemMatch: {$eq: Meteor.userId()}}}).fetch(),
            categories: Categories.find().fetch(),
            discussionTemplate: DiscussionTemplates.findOne({name: "Default - Users Can Edit Comments"}),
        };
    });

//check if user is in the discussion group
    const getOtherCategory = () => {
        if (categories.length > 0 && categoryId.length === 0) {
            setCategoryId(categories.find(cat => cat.title === 'Other')._id);
        }
    }
    useEffect(getOtherCategory, [categories]);

    // enable form items as this functionality becomes available
    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            closeOnDimmerClick={false}
            size="small"
        >
            <Tour TOUR_STEPS={createDiscussionTour}/>
            <Modal.Header className={'newDiscussion1'} >Create A Discussion</Modal.Header>
            <Modal.Content>
                <Form>
                    <Input
                        label="Discussion Title"
                        type="text"
                        placeholder="Discussion Title"
                        value={discussionTitle}
                        onInput={({target}) => setDiscussionTitle(target.value)}
                        autoFocus
                    />
                    {errTitle ? (
                        <div style={{height: "10px", color: "red", marginBottom: "10px"}}>{errTitle}</div>
                    ) : (
                        <div style={{height: "10px", marginBottom: "10px"}}/>
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
                        label="Category"
                        loading={categories.length === 0}
                        selection
                        search
                        options={
                            categories &&
                            categories.map((category) => ({
                                key: category._id,
                                text: category.title,
                                value: category._id,
                            }))
                        }
                        name="categories"
                        value={categoryId}
                        onChange={(e, {value}) => setCategoryId(value)}
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
                        disabled={!createNewGroup}
                        readOnly={!createNewGroup}
                    />
                        {errGroupName ? (
                            <div style={{height: "10px", color: "red", marginBottom: "10px"}}>{errGroupName}</div>
                        ) : (
                            <div style={{height: "10px", marginBottom: "10px"}}/>
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
