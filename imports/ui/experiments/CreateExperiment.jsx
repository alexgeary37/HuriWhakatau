import React, { useState, useEffect } from "react";
import { Segment, Form, Input, Modal, Button, Checkbox, Tab, Label } from "semantic-ui-react";
import { useTracker } from "meteor/react-meteor-data";
import { Scenarios } from "/imports/api/scenarios";
import { ScenarioSets } from "/imports/api/scenarioSets";
import { DiscussionTemplates } from "/imports/api/discussionTemplates";
import { Groups } from "/imports/api/groups";
import { responseSet } from "../../api/ratingResponses";

export const CreateExperiment = ({ toggleModal, isWizard, toggleIsWizard }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [scenarioSetId, setScenarioSetId] = useState("");
  const [introductionCommentText, setIntroductionCommentText] = useState(
    "Welcome to the " +
      "introduction discussion. Use this space to get to know each other and vote on a group leader before " +
      "you progress to the first topic."
  );
  const [hasIntroduction, setHasIntroduction] = useState(false);
  const [consensusThreshold, setConsensusThreshold] = useState(0);
  const [errName, setErrName] = useState("");
  const [errDescription, setErrDescription] = useState("");
  const [errGroupId, setErrGroupId] = useState("");
  const [errScenarioSetId, setErrScenarioSetId] = useState("");
  const [ratings, setRatings] = useState([
    { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
    { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
    { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
    { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
    { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
  ]);
  const [numberOfRatings, setNumberOfRatings] = useState(1);
  const nameRef = React.createRef();

  const setGroupIdAndThreshold = (groupId) => {
    setGroupId(groupId);
    const numGroupMembers = Groups.findOne(groupId).members.length;
    setConsensusThreshold(numGroupMembers - 1);
  };

  const setClampedConsensusThreshold = (value) => {
    const numGroupMembers = Groups.findOne(groupId).members.length;
    if (value <= numGroupMembers - 1 && value >= 1) {
      setConsensusThreshold(value);
    }
  };

  const submitExperiment = (e) => {
    if (name.length === 0) {
      setErrName("Experiments must have a name");
    } else {
      setErrName("");
    }
    if (description.length === 0) {
      setErrDescription("Experiments must have a description");
    } else {
      setErrDescription("");
    }
    if (scenarioSetId.length === 0) {
      setErrScenarioSetId("Experiments must have a scenario set");
    } else {
      setErrScenarioSetId("");
    }
    if (groupId.length === 0) {
      setErrGroupId("Experiments must have a group");
    } else {
      setErrGroupId("");
    }
    if (
      name.length > 0 &&
      description.length > 0 &&
      scenarioSetId.length > 0 &&
      groupId.length > 0
    ) {
      Meteor.call(
        "experiments.create",
        name,
        description,
        groupId,
        scenarioSetId,
        hasIntroduction,
        consensusThreshold,
        ratings,
        introductionCommentText
      );
      return true;
    }
    return false;
  };

  const resetFields = () => {
    setName("");
    setDescription("");
    setGroupId("");
    setScenarioSetId("");
    setHasIntroduction(false);
    setIntroductionCommentText(
      "Welcome to the " +
        "introduction discussion. Use this space to get to know each other and vote on a group leader before " +
        "you progress to the first topic."
    );
    setConsensusThreshold(0);
    setErrName("");
    setErrDescription("");
    setErrGroupId("");
    setErrScenarioSetId("");
    setNumberOfRatings(1);
    setRatings([
      { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
      { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
      { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
      { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
      { rating: "", scale: 7, reverse: false, responseType: "Agreement" },
    ]);
    nameRef.current.focus();
  }

  const toggleIt = (e) => {
    toggleModal();
    if (isWizard && e.currentTarget.innerHTML === "Cancel") {
      toggleIsWizard();
    }
  };

  const { groups, scenarioSets, scenarios, discussionTemplates } = useTracker(() => {
    Meteor.subscribe("groups");
    Meteor.subscribe("scenarioSets");
    Meteor.subscribe("scenarios");
    Meteor.subscribe("discussionTemplates");

    //todo filter by user who created group
    return {
      groups: Groups.find().fetch(),
      scenarioSets: ScenarioSets.find().fetch(),
      scenarios: Scenarios.find().fetch(),
      discussionTemplates: DiscussionTemplates.find().fetch()
    };
  });

  // Resets the setHasIntroduction hook whenever a set is selected by the user.
  useEffect(() => {
    if (setContainsHuiChat()) {
      setHasIntroduction(true);
    } else {
      setHasIntroduction(false);
    }
  }, [scenarioSetId]);

  // Returns true if the scenario set contains a hui chat.
  const setContainsHuiChat = () => {
    if (scenarioSets && scenarios && discussionTemplates) {
      const set = scenarioSets.find(set => set._id === scenarioSetId);
      if (set) {
        const scens = scenarios.filter(s => set.scenarios.includes(s._id));
        for (i = 0; i < scens.length; i += 1) {
          const template = discussionTemplates.find(template => template._id === scens[i].discussionTemplateId);
          if (template.isHui) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // the scales to be selected by the researcher for user ratings of comments
  const ratingScales = [
    { points: 2, range: "0-1" },
    { points: 3, range: "0-2" },
    { points: 5, range: "0-4" },
    { points: 7, range: "0-6" },
  ];
  const incrementNumberOfRatings = () => {
    setNumberOfRatings(numberOfRatings + 1);
  };

  // should collapse these to a single method
  const addRating = (target) => {
    let currentRatings = [...ratings];
    let index = parseInt(target.name);
    currentRatings[index].rating = target.value;
    setRatings((currentRatings) => [...currentRatings]);
  };

  const addScale = (data) => {
    let currentRatings = [...ratings];
    let index = parseInt(data.name);
    currentRatings[index].scale = data.value;
    setRatings((currentRatings) => [...currentRatings]);
  };

  const toggleRatingReverse = (data) => {
    let currentRatings = [...ratings];
    let index = parseInt(data.name);
    currentRatings[index].reverse = data.checked;
    setRatings((currentRatings) => [...currentRatings]);
  };

  const addResponseSet = (data) => {
    let currentRatings = [...ratings];
    let index = parseInt(data.name);
    currentRatings[index].responseType = data.value;
    setRatings((currentRatings) => [...currentRatings]);
  };

  const panes = [
    {
      menuItem: "Experiment Parameters",
      render: () => (
        <Tab.Pane style={{ border: "none" }}>
          <Form as={Segment} attached="bottom" style={{ border: "none" }}>
            <Input
              label="Name"
              type="text"
              autoFocus
              ref={nameRef}
              value={name}
              onInput={({ target }) => setName(target.value)}
            />
            {errName ? (
              <div
                style={{
                  height: "10px",
                  color: "red",
                  marginTop: "-13px",
                  marginBottom: "10px",
                }}
              >
                {errName}
              </div>
            ) : (
              <div
                style={{
                  height: "10px",
                  marginTop: "-13px",
                  marginBottom: "10px",
                }}
              />
            )}
            <Input
              label="Description"
              type="text"
              value={description}
              onInput={({ target }) => setDescription(target.value)}
            />
            {errDescription ? (
              <div
                style={{
                  height: "10px",
                  color: "red",
                  marginTop: "-13px",
                  marginBottom: "10px",
                }}
              >
                {errDescription}
              </div>
            ) : (
              <div
                style={{
                  height: "10px",
                  marginTop: "-13px",
                  marginBottom: "10px",
                }}
              />
            )}
            {/*show groups and scenarioSets, get ids for db*/}
            <Form.Group widths={2}>
              <Form.Dropdown
                label="Group"
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
                onChange={(e, { value }) => setGroupIdAndThreshold(value)}
              />
              {errGroupId ? (
                <div
                  style={{
                    height: "10px",
                    color: "red",
                    marginTop: "-13px",
                    marginBottom: "10px",
                  }}
                >
                  {errGroupId}
                </div>
              ) : (
                <div
                  style={{
                    height: "10px",
                    marginTop: "-13px",
                    marginBottom: "10px",
                  }}
                />
              )}
              <Form.Dropdown
                label="Scenario Set"
                loading={scenarioSets.length === 0}
                selection
                search
                options={
                  scenarioSets &&
                  scenarioSets.map((scenarioSet) => ({
                    key: scenarioSet._id,
                    text: scenarioSet.title,
                    value: scenarioSet._id,
                  }))
                }
                name="discussion templates"
                value={scenarioSetId}
                onChange={(e, { value }) => setScenarioSetId(value)}
              />
              {errScenarioSetId ? (
                <div
                  style={{
                    height: "10px",
                    color: "red",
                    marginTop: "-13px",
                    marginBottom: "10px",
                  }}
                >
                  {errScenarioSetId}
                </div>
              ) : (
                <div
                  style={{
                    height: "10px",
                    marginTop: "-13px",
                    marginBottom: "10px",
                  }}
                />
              )}
            </Form.Group>
            <Input
              style={{ width: "60px", rightMargin: "60px" }}
              type="number"
              disabled={groupId === ""}
              labelPosition="right"
              value={consensusThreshold}
              onInput={({ target }) => setClampedConsensusThreshold(Number(target.value))}
            >
              <Label>A consensus is reached once</Label>
              <input />
              <Label>users have affirmed a verdict</Label>
            </Input>
            <br />
            <Checkbox
              checked={hasIntroduction}
              label="Create an Introduction Lounge"
              onClick={(e, data) => {
                // Ensure the user cannot remove the introduction is the set contains a hui chat.
                if (!setContainsHuiChat()) {
                  setHasIntroduction(data.checked)
                }
              }}
              // Disable the checkbox if the set contains a hui chat.
              disabled={setContainsHuiChat()}
            />
            <br />
            <br />
            {hasIntroduction && (
              <Form.Field
                control={"textarea"}
                label={"Introductory comment"}
                title={
                  "A short introduction to the discussion that outlines any special " +
                  "requirements or instructions"
                }
                value={introductionCommentText}
                onChange={(event) =>
                  setIntroductionCommentText(event.currentTarget.value)
                }
              />
            )}
            <br />
          </Form>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Comment Ratings",
      render: () => (
        <Tab.Pane style={{ border: "none" }}>
          <Form as={Segment} attached="bottom" style={{ border: "none" }}>
            <Button.Group widths={5} disabled>
              {/* Using buttons as column labels as these scale in the same way as form groups*/}
              <Button basic content={"Rating"} style={{ textAlign: "left" }} />
              <Button basic content={"Scale"} style={{ textAlign: "left" }} />
              <Button
                basic
                content={"Response set"}
                style={{ textAlign: "left" }}
              />
              <Button
                basic
                content={"Responses"}
                style={{ textAlign: "left" }}
              />
              <Button
                basic
                content={"Reverse scoring"}
                style={{ textAlign: "left" }}
              />
            </Button.Group>
            <Form.Group widths={5}>
              <Form.Input
                name={"0"}
                type="text"
                placeholder={"User Rating condition 1"}
                autoFocus
                value={ratings[0].rating}
                onInput={({ target }) => addRating(target)}
              />
              <Form.Dropdown
                name={"0"}
                selection
                options={ratingScales.map((scale) => ({
                  key: scale.points,
                  text: scale.range,
                  value: scale.points,
                }))}
                value={ratings[0].scale}
                onChange={(event, data) => addScale(data)}
              />
              <Form.Dropdown
                name={"0"}
                selection
                options={responseSet.map((response) => ({
                  key: response.responseType,
                  text: response.responseType,
                  value: response.responseType,
                }))}
                value={ratings[0].responseType}
                onChange={(event, data) => addResponseSet(data)}
              />
              <Form.Field
                width={3}
                content={
                  responseSet.find(
                    (response) =>
                      response.responseType === ratings[0].responseType
                  ).fullRange[0] +
                  " - " +
                  responseSet.find(
                    (response) =>
                      response.responseType === ratings[0].responseType
                  ).fullRange[6]
                }
              />
              <Checkbox
                toggle
                name={"0"}
                checked={ratings[0].reverse}
                onChange={(event, data) => toggleRatingReverse(data)}
              />
            </Form.Group>
            {numberOfRatings > 1 && (
              <Form.Group widths={5}>
                <Form.Input
                  name={"1"}
                  type="text"
                  placeholder={"User Rating condition 2"}
                  value={ratings[1].rating}
                  onChange={({ target }) => addRating(target)}
                />
                <Form.Dropdown
                  name={"1"}
                  selection
                  options={ratingScales.map((scale) => ({
                    key: scale.points,
                    text: scale.range,
                    value: scale.points,
                  }))}
                  value={ratings[1].scale}
                  onChange={(event, data) => addScale(data)}
                />
                <Form.Dropdown
                  name={"1"}
                  selection
                  options={responseSet.map((response) => ({
                    key: response.responseType,
                    text: response.responseType,
                    value: response.responseType,
                  }))}
                  value={ratings[1].responseType}
                  onChange={(event, data) => addResponseSet(data)}
                />
                <Form.Field
                  width={3}
                  content={
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[1].responseType
                    ).fullRange[0] +
                    " - " +
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[1].responseType
                    ).fullRange[6]
                  }
                />
                <Checkbox
                  toggle
                  name={"1"}
                  checked={ratings[1].reverse}
                  onChange={(event, data) => toggleRatingReverse(data)}
                />
              </Form.Group>
            )}
            {numberOfRatings > 2 && (
              <Form.Group widths={5}>
                <Form.Input
                  name={"2"}
                  type="text"
                  placeholder={"User Rating condition 3"}
                  value={ratings[2].rating}
                  onChange={({ target }) => addRating(target)}
                />
                <Form.Dropdown
                  name={"2"}
                  selection
                  options={ratingScales.map((scale) => ({
                    key: scale.points,
                    text: scale.range,
                    value: scale.points,
                  }))}
                  value={ratings[2].scale}
                  onChange={(event, data) => addScale(data)}
                />
                <Form.Dropdown
                  name={"2"}
                  selection
                  options={responseSet.map((response) => ({
                    key: response.responseType,
                    text: response.responseType,
                    value: response.responseType,
                  }))}
                  value={ratings[2].responseType}
                  onChange={(event, data) => addResponseSet(data)}
                />
                <Form.Field
                  width={3}
                  content={
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[2].responseType
                    ).fullRange[0] +
                    " - " +
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[2].responseType
                    ).fullRange[6]
                  }
                />
                <Checkbox
                  toggle
                  name={"2"}
                  checked={ratings[2].reverse}
                  onChange={(event, data) => toggleRatingReverse(data)}
                />
              </Form.Group>
            )}
            {numberOfRatings > 3 && (
              <Form.Group widths={5}>
                <Form.Input
                  name={"3"}
                  type="text"
                  placeholder={"User Rating condition 4"}
                  value={ratings[3].rating}
                  onChange={({ target }) => addRating(target)}
                />
                <Form.Dropdown
                  name={"3"}
                  selection
                  options={ratingScales.map((scale) => ({
                    key: scale.points,
                    text: scale.range,
                    value: scale.points,
                  }))}
                  value={ratings[3].scale}
                  onChange={(event, data) => addScale(data)}
                />
                <Form.Dropdown
                  name={"3"}
                  selection
                  options={responseSet.map((response) => ({
                    key: response.responseType,
                    text: response.responseType,
                    value: response.responseType,
                  }))}
                  value={ratings[3].responseType}
                  onChange={(event, data) => addResponseSet(data)}
                />
                <Form.Field
                  width={3}
                  content={
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[3].responseType
                    ).fullRange[0] +
                    " - " +
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[3].responseType
                    ).fullRange[6]
                  }
                />
                <Checkbox
                  toggle
                  name={"3"}
                  checked={ratings[3].reverse}
                  onChange={(event, data) => toggleRatingReverse(data)}
                />
              </Form.Group>
            )}
            {numberOfRatings > 4 && (
              <Form.Group widths={5}>
                <Form.Input
                  name={"4"}
                  type="text"
                  placeholder={"User Rating condition 5"}
                  value={ratings[4].rating}
                  onChange={({ target }) => addRating(target)}
                />
                <Form.Dropdown
                  name={"4"}
                  selection
                  options={ratingScales.map((scale) => ({
                    key: scale.points,
                    text: scale.range,
                    value: scale.points,
                  }))}
                  value={ratings[4].scale}
                  onChange={(event, data) => addScale(data)}
                />
                <Form.Dropdown
                  name={"4"}
                  selection
                  options={responseSet.map((response) => ({
                    key: response.responseType,
                    text: response.responseType,
                    value: response.responseType,
                  }))}
                  value={ratings[4].responseType}
                  onChange={(event, data) => addResponseSet(data)}
                />
                <Form.Field
                  width={3}
                  content={
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[4].responseType
                    ).fullRange[0] +
                    " - " +
                    responseSet.find(
                      (response) =>
                        response.responseType === ratings[4].responseType
                    ).fullRange[6]
                  }
                />
                <Checkbox
                  toggle
                  name={"4"}
                  checked={ratings[4].reverse}
                  onChange={(event, data) => toggleRatingReverse(data)}
                />
              </Form.Group>
            )}
            {numberOfRatings < 5 && (
              <Button
                circular
                icon={"plus"}
                onClick={incrementNumberOfRatings}
              />
            )}
          </Form>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Modal open={true} closeOnDimmerClick={false} size="large">
      <Modal.Header>Create an Experiment</Modal.Header>
      <Modal.Content>
        <Tab menu={{ inverted: false }} panes={panes} />
        <Button
          content="Save & Close"
          onClick={(e) => {
            const submitted = submitExperiment(e);
            if (submitted) {
              toggleIt(e);
            }
          }}
          positive
        />
        <Button
          content="Save & Create Another"
          onClick={(e) => {
            const submitted = submitExperiment(e);
            if (submitted) {
              resetFields();
            }
          }}
          positive
        />
        <Button
          color="black"
          content="Cancel"
          onClick={(e) => {
            toggleIt(e);
          }}
        />
      </Modal.Content>
    </Modal>
  );
};
