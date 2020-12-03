import React from "react";
import {Button, Icon, List, ModalActions, Segment} from "semantic-ui-react";

export const UserSummary = ({
                                member,
                                handleUserVoted,
                                userHasVoted,
                                groupId,
                                groupLeader,
                                discussionStatus,
                                closeChat,
                                nextDiscussionId,
                            }) => {
    // based on dicussionsummary, update to take an actual user object and
    // display info. in the mean time it just takes a username and shows that
    const submitLeaderVote = (userId) => {
        console.log("user voted for: ", userId);
        Meteor.call("groups.voteLeader", groupId, userId);
        handleUserVoted();
    };

    const handleCloseChat = () => {
        //add an "are you sure" modal before changing discussion status.
        closeChat();
    };

    return (
        // <List.Item>
        //     <List.Content >
                <Segment compact>
                    {member.username}
                    {Meteor.userId() !== groupLeader && member._id === groupLeader && (
                        <span> (Group Leader)</span>
                    )}
                    {groupLeader === Meteor.userId() &&
                    groupLeader === member._id &&
                    discussionStatus === "active" && (
                        <Icon
                            title={'End discussion and go to next'}
                            className={'stop circle'}
                            // size={'large'}
                            // style={{margin: 10}}
                            // content={"Close chat"}
                            onClick={handleCloseChat}
                            color={'red'}
                        />
                    )}
                    {Meteor.userId() !== member._id &&
                    !groupLeader &&
                    (discussionStatus = "active") && (
                        <Button
                            disabled={userHasVoted}
                            positive
                            value={member._id}
                            content={"vote as leader"}
                            onClick={({target}) => {
                                submitLeaderVote(target.value);
                            }}
                        />
                    )}
                    {discussionStatus !== "active" &&
                    Meteor.userId() === member._id &&
                    nextDiscussionId && (
                            <Icon
                                title={'Go to next discussion'}
                                className={'arrow alternate circle right'}
                                // style={{margin: 10}}
                                // content={"Go to next"}
                                onClick={handleCloseChat}
                                color={'green'}
                            />
                    )}
                    <br/>
                    <Icon className="mountain"
                          size='small'
                          bordered
                          title={member.pepeha ?
                              member.pepeha.mountain ?
                              member.pepeha.mountain : "no mountain set" : "no mountain set"}/>
                    <Icon className="river"
                          size='small'
                          bordered
                          title={member.pepeha ?
                              member.pepeha.river ?
                              member.pepeha.river : "no river set" : "no river set"}/>
                    <Icon className="waka"
                          size='small'
                          bordered
                          title={member.pepeha ?
                              member.pepeha.waka ?
                              member.pepeha.waka : "no waka set" : "no waka set"}/>
                    <Icon className="iwi"
                          size='small'
                          bordered
                          title={member.pepeha ?
                              member.pepeha.iwi ?
                              member.pepeha.iwi : "no iwi set" : "no iwi set"}/>
                    <Icon className="user"
                          size='small'
                          bordered
                          title={member.pepeha ?
                              member.pepeha.role ?
                              member.pepeha.role : "no role set" : "no role set"}/>
                {/*<ModalActions>*/}
                {/*    */}
                {/*</ModalActions>*/}
                </Segment>
        //     </List.Content>
        // </List.Item>
    );
};
