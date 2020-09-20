import React, {useState} from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import {Button, List, ModalActions, Segment} from "semantic-ui-react";
import { Scenarios } from "/imports/api/scenarios";

export const UserSummary = ({ member, handleUserVoted, userHasVoted, groupId}) => {
    // based on dicussionsummary, update to take an actual user object and
    // display info. in the mean time it just takes a username and shows that
    // const [isIndigenous, setIsIndigenous] = useState(participantRole);
  // const { scenario } = useTracker(() => {
  //   Meteor.subscribe("scenarios");
  //
  //   return {
  //     scenario: Scenarios.findOne({ _id: discussion.scenarioId }),
  //   };
  // });
  //   // would like to set the path based on user role, but check is completed after
  //   // discussion summaries are loaded. need a call back in mydash or something
  //   let linkPath = isIndigenous ? "/huichat" : "/discussion";
    const submitLeaderVote = (userId) => {
        console.log("user voted for: ", userId);
        Meteor.call("groups.voteLeader",groupId, userId);
        handleUserVoted();
    }

  return (
    <List.Item>
      <List.Content
        // style={{
        //   backgroundColor: discussion.status === "active" ? "#FFF" : "#d3d3d3",
        // }}
        as={Segment}
      >
          {member.username}
          {Meteor.userId() !== member._id && <ModalActions>
              <Button disabled={userHasVoted} positive value={member._id} content={"vote"} onClick={({target}) => {
                  submitLeaderVote(target.value)
              }}/></ModalActions>
          }
        {/*<List.Header content={scenario && scenario.title} />*/}
        {/*<List.Description content={scenario && scenario.description} />*/}
      </List.Content>
    </List.Item>
  );
};
