import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Container, Segment, Form, Checkbox, Input, Label } from "semantic-ui-react";
import { NavBar } from "./NavBar";

export const CreateDiscussionTemplate = () => {
  const [anonymous, setAnonymous] = useState(false);
  const [typing, setTyping] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [canEdit, setCanEdit] = useState(true);
  const [isThreaded, setIsThreaded] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [charLimit, setCharLimit] = useState(0);

    // const { users, scenarioSets } = useTracker(() => {
  //   Meteor.subscribe("scenarioSets");
  //
  //   return {
  //     users: Meteor.users.find().fetch(),
  //     scenarioSets: ScenarioSets.find().fetch(),
  //   };
  // });

  // enable form items as this functionality becomes available
  return (
    <div>
      <NavBar />
      <Container>
        <Form as={Segment} attached="bottom">
          <Input
            label="Name"
            type="text"
            value={templateName}
            onInput={({ target }) => setTemplateName(target.value)}
            autoFocus
          />
          <br/>
          <br/>
          <Checkbox disabled label='Users are anonymous' onClick={(e, data)=> setAnonymous(data.checked)}/>
          <br/>
          <Checkbox disabled label='Show typing notifications' onClick={(e, data)=> setTyping(data.checked)}/>
          <br/>
          <Checkbox disabled checked={canEdit} label='Users can edit their own comments' onClick={(e, data)=> setCanEdit(data.checked)}/>
          <br/>
          <Checkbox disabled label='Comments are threaded' onClick={(e, data)=> setIsThreaded(data.checked)}/>
          <br/>
          <Checkbox disabled label='Show profile info (eg pic)' onClick={(e, data)=> setShowProfile(data.checked)}/>
          <br/>
          <br/>
          <Input style={{width:'60px', rightMargin:'60px'}} type='number' labelPosition='right' value={timeLimit}
                 onInput={({ target }) => setTimeLimit(target.value)}>
            <Label>Discussions have time limit</Label>
            <input/>
            <Label>mins</Label>
          </Input>
            <br/>
          <br/>
          <Input style={{width:'60px', rightMargin:'70px'}} type='number' labelPosition='right' value={charLimit}
                      onInput={({ target }) => setCharLimit(target.value)}>
            <Label>Comments have character limit</Label>
            <input/>
            <Label>characters</Label>
          </Input>
          {/*<Form.Field control={Form.Group} label="Members">*/}
          {/*  <Form.Dropdown*/}
          {/*    width={14}*/}
          {/*    loading={users.length === 0}*/}
          {/*    selection*/}
          {/*    multiple*/}
          {/*    search*/}
          {/*    options={*/}
          {/*      users &&*/}
          {/*      users.map((user) => ({*/}
          {/*        key: user._id,*/}
          {/*        text: user.username,*/}
          {/*        value: user._id,*/}
          {/*      }))*/}
          {/*    }*/}
          {/*    name="members"*/}
          {/*    value={members}*/}
          {/*    onChange={(e, { value }) => setMembers(value.concat())}*/}
          {/*  />*/}
          {/*</Form.Field>*/}
          <br/>
          <br/>
          <Form.Button
            content="Submit"
            onClick={() => {
            templateName &&
            Meteor.call("discussionTemplates.create", templateName, anonymous, typing, canEdit,
                isThreaded, showProfile, timeLimit, charLimit);
              }
            }
          />
        </Form>
      </Container>
    </div>
  );
};
