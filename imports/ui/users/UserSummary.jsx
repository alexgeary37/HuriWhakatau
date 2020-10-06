import React from "react";
import { Button, List, ModalActions, Segment } from "semantic-ui-react";

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
        <ModalActions>
          {Meteor.userId() !== member._id &&
            !groupLeader &&
            (discussionStatus = "active") && (
              <Button
                disabled={userHasVoted}
                positive
                value={member._id}
                content={"vote"}
                onClick={({ target }) => {
                  submitLeaderVote(target.value);
                }}
              />
            )}
          {groupLeader === Meteor.userId() &&
            groupLeader === member._id &&
            discussionStatus === "active" && (
              <div style={{ textAlign: "center" }}>
                <Button
                  style={{ margin: 10 }}
                  content={"Close chat"}
                  onClick={handleCloseChat}
                  primary
                />
              </div>
            )}
          {discussionStatus !== "active" && (
            <div style={{ textAlign: "center" }}>
              <Button
                style={{ margin: 10 }}
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
