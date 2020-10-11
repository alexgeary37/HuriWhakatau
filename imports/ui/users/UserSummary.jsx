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
        <List.Item>
            <List.Content as={Segment}>
                {member.username}
                {Meteor.userId() !== groupLeader && member._id === groupLeader && (
                    <div>Group Leader</div>
                )}
                <Segment>
                    <Icon className="mountain"
                          title={member.pepeha ?
                              member.pepeha.mountain ?
                              member.pepeha.mountain : "no mountain set" : "no mountain set"}/>
                    <Icon className="river"
                          title={member.pepeha ?
                              member.pepeha.river ?
                              member.pepeha.river : "no river set" : "no river set"}/>
                    <Icon className="waka"
                          title={member.pepeha ?
                              member.pepeha.waka ?
                              member.pepeha.waka : "no waka set" : "no waka set"}/>
                    <Icon className="iwi"
                          title={member.pepeha ?
                              member.pepeha.iwi ?
                              member.pepeha.iwi : "no iwi set" : "no iwi set"}/>
                    <Icon className="role"
                          title={member.pepeha ?
                              member.pepeha.role ?
                              member.pepeha.role : "no role set" : "no role set"}/>
                </Segment>
                <ModalActions>
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
                    {groupLeader === Meteor.userId() &&
                    groupLeader === member._id &&
                    discussionStatus === "active" && (
                        <div style={{textAlign: "center"}}>
                            <Button
                                style={{margin: 10}}
                                content={"Close chat"}
                                onClick={handleCloseChat}
                                primary
                            />
                        </div>
                    )}
                    {discussionStatus !== "active" &&
                    Meteor.userId() === member._id &&
                    nextDiscussionId && (
                        <div style={{textAlign: "center"}}>
                            <Button
                                style={{margin: 10}}
                                content={"Go to next"}
                                onClick={handleCloseChat}
                                primary
                            />
                        </div>
                    )}
                </ModalActions>
            </List.Content>
        </List.Item>
    );
};
