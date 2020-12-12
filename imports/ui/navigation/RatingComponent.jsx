import React, {useEffect, useState} from "react";
import {Random} from 'meteor/random'
import {indices, responseSet} from '/imports/api/ratingResponses'
import {
    Button, Container, Segment,
    Header, Message, List, Form,
    Icon, Card, ListItem, Rating,
    Divider, Image, Sidebar, Tab, ListContent, Checkbox, Placeholder,
} from "semantic-ui-react";

export const RatingComponent = () => {
    const [answerInt, setAnswerInt] = useState(0);
    const [typeOfQuestion, setTypeOfQuestion] = useState(-1);
    const [answerString, setAnswerString] = useState("");
    const [submitErr, setSubmitErr] = useState("");
    const [questionItem, setQuestionItem] = useState(
        {
                    itemId: "",
                    itemNumber: 0,
                    headerText: "",
                    bodyText: "",
                    scale: 7,
                    reverse: false,
                    ratingLabels: [],
                });

    let rating;
    let responseIndices;
    let responses;
    let labelSet = [];
    let comment;
    let question;
    let id = "";
    let itemNum = 0;
    let header = "";
    let body = "";
    let ratingScale = 7;
    let ratingReverse = false;
    let questionType;

    const updateQuestion = () =>{
        setSubmitErr("");
        setAnswerInt(0);
        setAnswerString("");
        questionType = Random.choice([0,1]);
        setTypeOfQuestion(questionType);
        if (questionType) {
            Meteor.call("experiments.getRandomExperimentForRating"
                , (err, fetchedExperimentArray) => {
                    let experiment = fetchedExperimentArray[0];
                    let exptRatings = experiment.ratings.filter(rating => rating.rating !== "");
                    // Select a random rating from the experiment's rating set
                    rating = exptRatings[Math.floor(Math.random() * Math.floor(exptRatings.length))]
                    // find the appropriate response set
                    responses = responseSet.find(set => set.responseType === rating.responseType)
                    ratingScale = rating.scale;
                    ratingReverse = rating.reverse;
                    responseIndices = indices[ratingScale];
                    // get the appropriate labels given the number of responses set eg 2, 5 or 7
                    // responseIndices.forEach(index => labelSet.push(responses.fullRange[index]));
                    indices[ratingScale].forEach(index => labelSet.push(responses.fullRange[index]));
                    header = rating.rating;
                    // get a random comment for a discussion in the experiment.
                    Meteor.call("comments.getRandomExperimentCommentForRating", experiment.discussions
                        , (err, fetchedCommentArray) => {
                            comment = fetchedCommentArray[0];
                            id = comment._id;
                            body = comment.text;

                            setQuestionItem({
                                itemId: id,
                                experimentId: experiment._id,
                                itemNumber: itemNum,
                                headerText: header,
                                bodyText: body,
                                scale: ratingScale,
                                reverse: ratingReverse,
                                ratingLabels: labelSet,
                            })
                        });
                    });
        } else {
            Meteor.call("personality.getRandomQuestion", (err, fetchedQuestionArray) => {
                question = fetchedQuestionArray[0];
                id = question._id;
                itemNum = question.item.item;
                header = question.item.text;
                body = "";
                ratingScale = question.item.scale;
                ratingReverse = question.item.scoringReversed;
                responses = responseSet.find(set => set.responseType === question.item.responseType)
                responseIndices = indices[ratingScale];
                // get the appropriate labels given the number of responses set eg 2, 5 or 7
                responseIndices.forEach(index => labelSet.push(responses.fullRange[index]));

                setQuestionItem({
                    itemId: id,
                    itemNumber: itemNum,
                    headerText: header,
                    bodyText: body,
                    scale: ratingScale,
                    reverse: ratingReverse,
                    ratingLabels: labelSet,
                })
            })
        }
    }

    // fetch first question on page load
    useEffect(() => {
        updateQuestion();
    }, [])

    const addAnswerValue = (value) => {
        let ratingLabels = [...questionItem.ratingLabels];
        let score = questionItem.reverse ?
            ratingLabels.reverse().indexOf(value) : ratingLabels.indexOf(value)

        setAnswerString(value);
        setAnswerInt(score);
    }

    const submitAnswer = () => {
        //todo work out what submitting an answer looks like / does.
        if(answerString){
            if(typeOfQuestion){
                Meteor.call("commentRatings.addRating", questionItem.itemId, questionItem.experimentId, {userId: Meteor.userId(), ratingText: questionItem.headerText, ratingScore: answerInt})
            } else {
                Meteor.call("users.recordPersonalityAnswer", Meteor.userId(), {questionnaireId : questionItem.itemId, item: questionItem.itemNumber, answerScore: answerInt})
            }
            updateQuestion();
        } else {
            setSubmitErr("You must select an option before submitting")
        }
    }

    return (
        <div>
            <Header as={'h3'} content={"question"} inverted/>
            <ListItem key={Math.random()}>
                <ListContent as={Segment} style={{
                    backgroundColor: "#c4c4c4",
                }}>
                    {questionItem.headerText ?
                    <List.Header as={'h4'}
                                 content={questionItem.headerText}
                    />
                    :
                    <Placeholder>
                        <Placeholder.Line length={'full'} style={{backgroundColor: "#c4c4c4"}}/>
                        <Placeholder.Line length={'very long'} style={{backgroundColor: "#c4c4c4"}}/>
                        <Placeholder.Line length={'medium'} style={{backgroundColor: "#c4c4c4"}}/>
                    </Placeholder>
                        }
                    {questionItem.bodyText &&
                    <List.Description as={Segment}
                                      content={questionItem.bodyText}
                    />
                    }
                    <hr/>
                    {questionItem.ratingLabels.length > 0 ? questionItem.ratingLabels.map((label) =>
                        <Form.Field key={label}>
                            <Checkbox
                                radio
                                label={label}
                                name='quixbox'
                                value={label}
                                checked={answerString === label}
                                onChange={(e, data) => addAnswerValue(data.value)}
                            />
                        </Form.Field>
                    )
                    :
                        <Placeholder>
                            <Placeholder.Line length={'medium'} style={{backgroundColor: "#c4c4c4"}}/>
                            <Placeholder.Line length={'medium'} style={{backgroundColor: "#c4c4c4"}}/>
                            <Placeholder.Line length={'medium'} style={{backgroundColor: "#c4c4c4"}}/>
                            <Placeholder.Line length={'medium'} style={{backgroundColor: "#c4c4c4"}}/>
                            <Placeholder.Line length={'medium'} style={{backgroundColor: "#c4c4c4"}}/>
                        </Placeholder>
                    }
                    <p style={{color:'red', height:"10px"}}>{submitErr && submitErr}</p>
                    <Button content={'Submit Answer'} onClick={submitAnswer}/>
                    <Button content={'Different Question'} onClick={updateQuestion}/>
                </ListContent>
            </ListItem>
        </div>
    )
}

