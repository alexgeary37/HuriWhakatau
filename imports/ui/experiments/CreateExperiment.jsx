import React, {useEffect, useState} from "react";
import {Container, Segment, Form, Modal, Button, Checkbox, Tab, Label, Input} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {useTracker} from "meteor/react-meteor-data";
import {ScenarioSets} from "/imports/api/scenarioSets";
import {Groups} from "/imports/api/groups";
import {responseSet} from "../../api/ratingResponses";

export const CreateExperiment = ({toggleModal, isWizard, toggleIsWizard}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [groupId, setGroupId] = useState("");
    const [scenarioSetId, setScenarioSetId] = useState("");
    const [introductionCommentText, setIntroductionCommentText] = useState("Welcome to the " +
        "introduction discussion. Use this space to get to know each other and vote on a group leader before " +
        "you progress to the first topic.");
    const [isOpen, setIsOpen] = useState(true);
    const [hasIntroduction, setHasIntroduction] = useState(false);
    const [errName, setErrName] = useState("");
    const [errDescription, setErrDescription] = useState("");
    const [errGroupId, setErrGroupId] = useState("");
    const [errScenarioSetId, setErrScenarioSetId] = useState("");
    const [ratings, setRatings] = useState([
        {rating: "", scale: 7, reverse: false, responseType: "Agreement"},
        {rating: "", scale: 7, reverse: false, responseType: "Agreement"},
        {rating: "", scale: 7, reverse: false, responseType: "Agreement"},
        {rating: "", scale: 7, reverse: false, responseType: "Agreement"},
        {rating: "", scale: 7, reverse: false, responseType: "Agreement"}]);
    const [numberOfRatings, setNumberOfRatings] = useState(1);

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
        if (name.length > 0 && description.length > 0 && scenarioSetId.length > 0 && groupId.length > 0) {
            Meteor.call(
                "experiments.create",
                name,
                description,
                groupId,
                scenarioSetId,
                hasIntroduction,
                ratings,
                introductionCommentText,
            );
            toggleIt(e);
        }
    }

    const toggleIt = (e) => {
        setIsOpen(false);
        toggleModal();
        if (isWizard && e.currentTarget.innerHTML === "Cancel") {
            toggleIsWizard();
        }
    }

    const {groups, scenarioSets} = useTracker(() => {
        Meteor.subscribe("groups");
        Meteor.subscribe("scenarioSets");

        //todo filter by user who created group
        return {
            groups: Groups.find().fetch(),
            scenarioSets: ScenarioSets.find().fetch(),
        };
    });

    // the scales to be selected by the researcher for user ratings of comments
    const ratingScales = [
        {points: 2, range: "0-1"},
        {points: 3, range: "0-2"},
        {points: 5, range: "0-4"},
        {points: 7, range: "0-6"}
    ];
    const incrementNumberOfRatings = () => {
        setNumberOfRatings(numberOfRatings + 1);
    }

    // should collapse these to a single method
    const addRating = (target) => {
        let currentRatings = [...ratings];
        let index = parseInt(target.name);
        currentRatings[index].rating = target.value;
        setRatings(currentRatings => [...currentRatings]);
    }

    const addScale = (data) => {
        let currentRatings = [...ratings];
        let index = parseInt(data.name);
        currentRatings[index].scale = data.value;
        setRatings(currentRatings => [...currentRatings]);
    }

    const toggleRatingReverse = (data) => {
        let currentRatings = [...ratings];
        let index = parseInt(data.name);
        currentRatings[index].reverse = data.checked;
        setRatings(currentRatings => [...currentRatings]);
    }

    const addResponseSet = (data) => {
        let currentRatings = [...ratings];
        let index = parseInt(data.name);
        currentRatings[index].responseType = data.value;
        setRatings(currentRatings => [...currentRatings]);
    }

    const printText = (e) => {
        console.log(e);
        console.log(introductionCommentText);
    }

    // const responseSet = [
    //     {type: "Frequency", range: "Never-Always"},
    //     {type: "Quality", range: "V.Poor-Excellent"},
    //     {type: "Intensity", range: "None-Severe"},
    //     {type: "Agreement", range: "S.Disagree-S.Agree"},
    //     {type: "Approval", range: "S.Disapprove-S.Approve"},
    //     {type: "Awareness", range: "Not Aware-Extremely Aware"},
    //     {type: "Importance", range: "Not at all Important-Extremely Important"},
    //     {type: "Familiarity", range: "Not at all Familiar-Extremely Familiar"},
    //     {type: "Satisfaction", range: "Not at all Satisfied-Extremely Satisfied"},
    //     {type: "Performance", range: "Far below Standards-Far above Standards"},
    // ];

    const panes = [
        {
            menuItem: 'Experiment Parameters', render: () =>
                <Tab.Pane style={{border: 'none'}}>
                    <Form as={Segment} attached="bottom" style={{border: 'none'}}>
                        <Form.Input
                            label="Name"
                            type="text"
                            autoFocus
                            value={name}
                            onInput={({target}) => setName(target.value)}
                        />
                        {errName ? (
                            <div style={{
                                height: "10px",
                                color: "red",
                                marginTop: "-13px",
                                marginBottom: "10px"
                            }}>{errName}</div>
                        ) : (
                            <div style={{height: "10px", marginTop: "-13px", marginBottom: "10px"}}/>
                        )}
                        <Form.Input
                            label="Description"
                            type="text"
                            value={description}
                            onInput={({target}) => setDescription(target.value)}
                        />
                        {errDescription ? (
                            <div style={{
                                height: "10px",
                                color: "red",
                                marginTop: "-13px",
                                marginBottom: "10px"
                            }}>{errDescription}</div>
                        ) : (
                            <div style={{height: "10px", marginTop: "-13px", marginBottom: "10px"}}/>
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
                            onChange={(e, {value}) => setGroupId(value)}
                        />
                        {errGroupId ? (
                            <div style={{
                                height: "10px",
                                color: "red",
                                marginTop: "-13px",
                                marginBottom: "10px"
                            }}>{errGroupId}</div>
                        ) : (
                            <div style={{height: "10px", marginTop: "-13px", marginBottom: "10px"}}/>
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
                            onChange={(e, {value}) => setScenarioSetId(value)}
                        />
                        {errScenarioSetId ? (
                            <div style={{
                                height: "10px",
                                color: "red",
                                marginTop: "-13px",
                                marginBottom: "10px"
                            }}>{errScenarioSetId}</div>
                        ) : (
                            <div style={{height: "10px", marginTop: "-13px", marginBottom: "10px"}}/>
                        )}
                        </Form.Group>
                        <Checkbox checked={hasIntroduction} label='Create an Introduction Lounge'
                                  onClick={(e, data) => setHasIntroduction(data.checked)}/>
                        <br/>
                        <br/>
                        {hasIntroduction && <Form.Field
                            control={'textarea'}
                            label={'Introductory comment'}
                            title={'A short introduction to the discussion that outlines any special ' +
                            'requirements or instructions'}
                            value={introductionCommentText}
                            onChange={(event) => setIntroductionCommentText(event.currentTarget.value)}/>}
                        <br/>
                    </Form>
                </Tab.Pane>
        },
        {
            menuItem: 'Comment Ratings', render: () =>
                <Tab.Pane style={{border: 'none'}}>
                    <Form as={Segment} attached="bottom" style={{border: 'none'}}>
                        <Button.Group widths={5} disabled>
                            {/* Using buttons as column labels as these scale in the same way as form groups*/}
                            <Button basic content={"Rating"} style={{textAlign: 'left'}}/>
                            <Button basic content={"Scale"} style={{textAlign: 'left'}}/>
                            <Button basic content={"Response set"} style={{textAlign: 'left'}}/>
                            <Button basic content={"Responses"} style={{textAlign: 'left'}}/>
                            <Button basic content={"Reverse scoring"} style={{textAlign: 'left'}}/>
                        </Button.Group>
                        <Form.Group widths={5}>
                            <Form.Input
                                name={'0'}
                                type="text"
                                placeholder={'User Rating condition 1'}
                                autoFocus
                                value={ratings[0].rating}
                                onInput={({target}) => (addRating(target))}
                            />
                            <Form.Dropdown
                                name={'0'}
                                selection
                                options={
                                    ratingScales.map((scale) => ({
                                        key: scale.points,
                                        text: scale.range,
                                        value: scale.points,
                                    }))
                                }
                                value={ratings[0].scale}
                                onChange={(event, data) => addScale(data)}
                            />
                            <Form.Dropdown
                                name={'0'}
                                selection
                                options={
                                    responseSet.map((response) => ({
                                        key: response.type,
                                        text: response.type,
                                        value: response.type,
                                    }))
                                }
                                value={ratings[0].responseType}
                                onChange={(event, data) => addResponseSet(data)}
                            />
                            <Form.Field width={3}
                                        content={responseSet.filter(response => response.type === ratings[0].responseType)[0].range}/>
                            <Checkbox toggle
                                      name={'0'}
                                      checked={ratings[0].reverse}
                                      onChange={(event, data) => toggleRatingReverse(data)}
                            />
                        </Form.Group>
                        {numberOfRatings > 1 &&
                        <Form.Group widths={5}>
                            <Form.Input
                                name={'1'}
                                type="text"
                                placeholder={'User Rating condition 2'}
                                value={ratings[1].rating}
                                onChange={({target}) => (addRating(target))}/>
                            <Form.Dropdown
                                name={'1'}
                                selection
                                options={
                                    ratingScales.map((scale) => ({
                                        key: scale.points,
                                        text: scale.range,
                                        value: scale.points,
                                    }))
                                }
                                value={ratings[1].scale}
                                onChange={(event, data) => addScale(data)}
                            />
                            <Form.Dropdown
                                name={'1'}
                                selection
                                options={
                                    responseSet.map((response) => ({
                                        key: response.type,
                                        text: response.type,
                                        value: response.type,
                                    }))
                                }
                                value={ratings[1].responseType}
                                onChange={(event, data) => addResponseSet(data)}
                            />
                            <Form.Field width={3}
                                         content={responseSet.filter(response => response.type === ratings[1].responseType)[0].range}/>
                            <Checkbox toggle
                                      name={'1'}
                                      checked={ratings[1].reverse}
                                      onChange={(event, data) => toggleRatingReverse(data)}
                            />
                        </Form.Group>}
                        {numberOfRatings > 2 &&
                        <Form.Group widths={5}>
                            <Form.Input
                                name={'2'}
                                type="text"
                                placeholder={'User Rating condition 3'}
                                value={ratings[2].rating}
                                onChange={({target}) => (addRating(target))}/>
                            <Form.Dropdown
                                name={'2'}
                                selection
                                options={
                                    ratingScales.map((scale) => ({
                                        key: scale.points,
                                        text: scale.range,
                                        value: scale.points,
                                    }))
                                }
                                value={ratings[2].scale}
                                onChange={(event, data) => addScale(data)}
                            />
                            <Form.Dropdown
                                name={'2'}
                                selection
                                options={
                                    responseSet.map((response) => ({
                                        key: response.type,
                                        text: response.type,
                                        value: response.type,
                                    }))
                                }
                                value={ratings[2].responseType}
                                onChange={(event, data) => addResponseSet(data)}
                            />
                            <Form.Field width={3}
                                        content={responseSet.filter(response => response.type === ratings[2].responseType)[0].range}/>
                            <Checkbox toggle
                                      name={'2'}
                                      checked={ratings[2].reverse}
                                      onChange={(event, data) => toggleRatingReverse(data)}
                            />
                        </Form.Group>}
                        {numberOfRatings > 3 &&
                        <Form.Group widths={5}>
                            <Form.Input
                                name={'3'}
                                type="text"
                                placeholder={'User Rating condition 4'}
                                value={ratings[3].rating}
                                onChange={({target}) => (addRating(target))}/>
                            <Form.Dropdown
                                name={'3'}
                                selection
                                options={
                                    ratingScales.map((scale) => ({
                                        key: scale.points,
                                        text: scale.range,
                                        value: scale.points,
                                    }))
                                }
                                value={ratings[3].scale}
                                onChange={(event, data) => addScale(data)}
                            />
                            <Form.Dropdown
                                name={'3'}
                                selection
                                options={
                                    responseSet.map((response) => ({
                                        key: response.type,
                                        text: response.type,
                                        value: response.type,
                                    }))
                                }
                                value={ratings[3].responseType}
                                onChange={(event, data) => addResponseSet(data)}
                            />
                            <Form.Field width={3}
                                        content={responseSet.filter(response => response.type === ratings[3].responseType)[0].range}/>
                            <Checkbox toggle
                                      name={'3'}
                                      checked={ratings[3].reverse}
                                      onChange={(event, data) => toggleRatingReverse(data)}
                            />
                        </Form.Group>}
                        {numberOfRatings > 4 &&
                        <Form.Group widths={5}>
                            <Form.Input
                                name={'4'}
                                type="text"
                                placeholder={'User Rating condition 5'}
                                value={ratings[4].rating}
                                onChange={({target}) => (addRating(target))}/>
                            <Form.Dropdown
                                name={'4'}
                                selection
                                options={
                                    ratingScales.map((scale) => ({
                                        key: scale.points,
                                        text: scale.range,
                                        value: scale.points,
                                    }))
                                }
                                value={ratings[4].scale}
                                onChange={(event, data) => addScale(data)}
                            />
                            <Form.Dropdown
                                name={'4'}
                                selection
                                options={
                                    responseSet.map((response) => ({
                                        key: response.type,
                                        text: response.type,
                                        value: response.type,
                                    }))
                                }
                                value={ratings[4].responseType}
                                onChange={(event, data) => addResponseSet(data)}
                            />
                            <Form.Field width={3}
                                        content={responseSet.filter(response => response.type === ratings[4].responseType)[0].range}/>
                            <Checkbox toggle
                                      name={'4'}
                                      checked={ratings[4].reverse}
                                      onChange={(event, data) => toggleRatingReverse(data)}
                            />
                        </Form.Group>}
                        {numberOfRatings < 5 &&
                        <Button
                            circular
                            icon={'plus'}
                            onClick={incrementNumberOfRatings}
                        />}
                    </Form>
                </Tab.Pane>
        },
    ];

    return (
        <Modal
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            open={isOpen}
            closeOnDimmerClick={false}
            size="large"
        >
            <Modal.Header>Create an Experiment</Modal.Header>
            <Modal.Content>
                <Tab menu={{inverted: false}} panes={panes}/>
                <Button
                    content="Save & Close"
                    onClick={(e) => {
                        submitExperiment(e);
                    }}
                    positive
                />
                <Button color='black' onClick={(e) => {
                    toggleIt(e)
                }}>
                    Cancel
                </Button>
            </Modal.Content>
        </Modal>
    );
};
