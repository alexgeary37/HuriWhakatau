import React, { useState } from "react";
import {
  Form,
  Checkbox,
  Input,
  Label,
  Modal,
  Button,
  List,
  Grid,
} from "semantic-ui-react";
import {HelpModal} from "/imports/ui/navigation/helpModal"

export const CreateDiscussionTemplate = ({ toggleModal }) => {
  const [anonymous, setAnonymous] = useState(false);
  const [typing, setTyping] = useState(true);
  const [templateName, setTemplateName] = useState("");
  const [canEdit, setCanEdit] = useState(true);
  const [isThreaded, setIsThreaded] = useState(false);
  const [isHui, setIsHui] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [canAddEmojis, setCanAddEmojis] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [charLimit, setCharLimit] = useState(0);
  const [errName, setErrName] = useState("");
  //text for the help modal component, discussion time limit & hui format
  const timeLimitHelpText = 'Set to zero for unlimited time'
  const huiHelpText = 'Discussion has a group leader and shows user pepeha and allows emotion selection'
  const nameRef = React.createRef();

  const submitTemplate = () => {
    if (templateName.length === 0) {
      setErrName("Templates must have a name");
      return false;
    } else {
      setTemplateName("");
      Meteor.call(
        "discussionTemplates.create",
        templateName,
        anonymous,
        typing,
        canEdit,
        isThreaded,
        showProfile,
        canAddEmojis,
        timeLimit,
        charLimit,
        isHui,
        isPublic
      );
      return true;
    }
  };

  const resetFields = () => {
    setAnonymous(false);
    setTyping(true);
    setTemplateName("");
    setCanEdit(true);
    setIsThreaded(false);
    setIsHui(false);
    setIsPublic(false);
    setShowProfile(false);
    setCanAddEmojis(false);
    setTimeLimit(0);
    setCharLimit(0);
    setErrName("");
    nameRef.current.focus(); // Reset autoFocus for template name input field
  };

  const toggleIt = () => {
    toggleModal();
  };

  // enable form items as this functionality becomes available
  return (
    <Modal open={true} closeOnDimmerClick={false} size="small">
      <Modal.Header>Create A Discussion Template</Modal.Header>
      <Modal.Content>
        <Form>
          <Input
            label="Template Name"
            type="text"
            placeholder="Template Name"
            value={templateName}
            onInput={({ target }) => setTemplateName(target.value)}
            autoFocus
            ref={nameRef}
          />
          {errName ? (
            <div style={{ height: "10px", color: "red", marginBottom: "10px" }}>
              {errName}
            </div>
          ) : (
            <div style={{ height: "10px", marginBottom: "10px" }} />
          )}
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <List>
                  <List.Item>
                    <Checkbox
                      checked={typing}
                      label="Show typing notifications"
                      onClick={(e, data) => setTyping(data.checked)}
                    />
                  </List.Item>
                  <List.Item>
                    <Checkbox
                      checked={canEdit}
                      label="Users can edit their own comments"
                      onClick={(e, data) => setCanEdit(data.checked)}
                    />
                  </List.Item>
                  <List.Item>
                    <Checkbox
                      checked={isHui}
                      label="Discussions use the Hui format"
                      onClick={(e, data) => setIsHui(data.checked)}
                    />
                    <HelpModal text={huiHelpText}/>
                  </List.Item>
                  <List.Item>
                    <Checkbox
                      checked={isPublic}
                      label="Discussions open to the public"
                      onClick={(e, data) => setIsPublic(data.checked)}
                    />
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <List>
                  <List.Item>
                    <Checkbox
                      disabled
                      readOnly
                      checked={anonymous}
                      label="Users are anonymous"
                      onClick={(e, data) => setAnonymous(data.checked)}
                    />
                  </List.Item>
                  <List.Item>
                    <Checkbox
                      disabled
                      readOnly
                      checked={isThreaded}
                      label="Comments are threaded"
                      onClick={(e, data) => setIsThreaded(data.checked)}
                    />
                  </List.Item>
                  <List.Item>
                    <Checkbox
                      disabled
                      readOnly
                      checked={showProfile}
                      label="Show profile info (eg pic)"
                      onClick={(e, data) => setShowProfile(data.checked)}
                    />
                  </List.Item>
                  <List.Item>
                    <Checkbox
                      disabled
                      readOnly
                      checked={canAddEmojis}
                      label="Users can add comment reactions"
                      onClick={(e, data) => setCanAddEmojis(data.checked)}
                    />
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <br />
          <Input
            style={{ width: "60px", rightMargin: "60px" }}
            type="number"
            labelPosition="right"
            value={timeLimit}
            onInput={({ target }) => setTimeLimit(Number(target.value))}
          >
            <Label>Discussions have time limit</Label>
            <input />
            <Label>mins</Label>
            <HelpModal text={timeLimitHelpText}/>
          </Input>
          <br />
          <br />
          <Input
            readOnly
            disabled
            style={{ width: "60px", rightMargin: "70px" }}
            type="number"
            labelPosition="right"
            value={charLimit}
            onInput={({ target }) => setCharLimit(Number(target.value))}
          >
            <Label>Comments have character limit</Label>
            <input />
            <Label>characters</Label>
          </Input>
          <br />
          <br />
          <Modal.Actions>
            <Button
              content="Save"
              onClick={() => {
                const submitted = submitTemplate();
                if (submitted) {
                  toggleIt();
                }
              }}
              positive
            />
            <Button
              content="Save & Create Another"
              onClick={() => {
                const submitted = submitTemplate();
                if (submitted) {
                  resetFields();
                }
              }}
              positive
            />
            <Button color="black" content="Cancel" onClick={toggleIt} />
          </Modal.Actions>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
