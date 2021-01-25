import React, { useEffect, useState } from "react";
import { Button, Icon, Segment } from "semantic-ui-react";
import { Picker } from "emoji-mart";

export const UserSummary = ({
  member,
  handleUserVoted,
  userHasVoted,
  groupId,
  groupLeader,
  discussionStatus,
  closeChat,
  nextDiscussionId,
  experimentId,
  isIntroduction,
}) => {
  const [userEmotionalColour, setUserEmotionalColour] = useState("white");

  // send user vote to db and calculate winner
  const submitLeaderVote = (userId) => {
    Meteor.call("experiments.voteLeader", experimentId, groupId, userId);
    handleUserVoted();
  };

  const handleCloseChat = () => {
    //add an "are you sure" modal before changing discussion status.
    closeChat();
  };

  const emotions = [
    {
      id: "slightly_smiling_face",
      name: "slightly_smiling_face",
      short_names: ["slightly_smiling_face"],
    },
    {
      id: "neutral_face",
      name: "neutral_face",
      short_names: ["neutral_face"],
    },
    {
      id: "slightly_frowning_face",
      name: "slightly_frowning_face",
      short_names: ["slightly_frowning_face"],
    },
    {
      id: "angry",
      name: "angry",
      short_names: ["angry"],
    },
  ];

  const handleEmotionSelect = (emoji) => {
    let emotion;
    switch (emoji.id) {
      case "slightly_smiling_face":
        emotion = "happy";
        break;
      case "neutral_face":
        emotion = "neutral";
        break;
      case "slightly_frowning_face":
        emotion = "unhappy";
        break;
      case "angry":
        emotion = "angry";
        break;
      default:
        emotion = "neutral";
        break;
    }

    const emotionOb = {
      emotion: emotion,
      timestamp: Date.now(),
    };
    Meteor.call("users.setEmotion", Meteor.userId(), emotionOb);
  };

  const memberEmotionColour = () => {
    switch (member?.profile?.emotion?.emotion) {
      case "happy":
        setUserEmotionalColour("yellow");
        break;
      case "neutral":
        setUserEmotionalColour("white");
        break;
      case "unhappy":
        setUserEmotionalColour("#1E90FF");
        break;
      case "angry":
        setUserEmotionalColour("red");
        break;
      default:
        setUserEmotionalColour("white");
        break;
    }
  };

  useEffect(memberEmotionColour, [member?.profile?.emotion?.emotion]);

  console.log('Meteor.userId() !== member._id', Meteor.userId() !== member._id)
  console.log('isIntroduction', isIntroduction)
  console.log('!groupLeader', !groupLeader)
  console.log('!userHasVoted', !userHasVoted)
  console.log('(discussionStatus = "active")', (discussionStatus = "active"))

  return (
    <Segment
      compact
      style={{
        backgroundColor:
          Meteor.userId() === groupLeader || Meteor.userId() === member._id
            ? userEmotionalColour
            : "white",
      }}
    >
      {member.username}
      {Meteor.userId() !== groupLeader && member._id === groupLeader && (
        <span>
          <br /> (Group Leader)
        </span>
      )}
      {groupLeader === Meteor.userId() &&
        groupLeader === member._id &&
        discussionStatus === "active" && (
          <Icon
            title={"End discussion and go to next"}
            className={"stop circle"}
            onClick={handleCloseChat}
            color={"red"}
          />
        )}
      {Meteor.userId() !== member._id &&
        isIntroduction &&
        !groupLeader &&
        !userHasVoted &&
        (discussionStatus = "active") && (
          <Button
            disabled={userHasVoted}
            positive
            value={member._id}
            content={"Vote as leader"}
            onClick={({ target }) => {
              submitLeaderVote(target.value);
            }}
          />
        )}
      {discussionStatus !== "active" &&
        Meteor.userId() === member._id &&
        nextDiscussionId && (
          <Icon
            title={"Go to next discussion"}
            className={"arrow alternate circle right"}
            onClick={handleCloseChat}
            color={"green"}
          />
        )}
      <br />
      <Icon
        className="mountain"
        size="small"
        bordered
        title={
          member.profile.pepeha
            ? member.profile.pepeha.mountain
              ? member.profile.pepeha.mountain
              : "no mountain set"
            : "no mountain set"
        }
      />
      <Icon
        className="river"
        size="small"
        bordered
        title={
          member.profile.pepeha
            ? member.profile.pepeha.river
              ? member.profile.pepeha.river
              : "no river set"
            : "no river set"
        }
      />
      <Icon
        className="waka"
        size="small"
        bordered
        title={
          member.profile.pepeha
            ? member.profile.pepeha.waka
              ? member.profile.pepeha.waka
              : "no waka set"
            : "no waka set"
        }
      />
      <Icon
        className="iwi"
        size="small"
        bordered
        title={
          member.profile.pepeha
            ? member.profile.pepeha.iwi
              ? member.profile.pepeha.iwi
              : "no iwi set"
            : "no iwi set"
        }
      />
      <Icon
        className="user"
        size="small"
        bordered
        title={
          member.profile.pepeha
            ? member.profile.pepeha.role
              ? member.profile.pepeha.role
              : "no role set"
            : "no role set"
        }
      />
      {discussionStatus === "active" && Meteor.userId() === member._id && (
        <div className="reactions">
          <Picker
            style={{ width: "auto", marginTop: "-15px", paddingBottom: "-5px" }}
            showPreview={false}
            showSkinTones={false}
            include={["custom"]}
            emojiSize={18}
            custom={emotions}
            onSelect={handleEmotionSelect}
          />
        </div>
      )}
    </Segment>
  );
};
