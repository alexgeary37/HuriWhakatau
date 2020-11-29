import React, {useEffect, useState} from "react";
import {Random} from 'meteor/random'
import {indices, responseSet} from '/imports/api/ratingResponses'
import {useTracker} from "meteor/react-meteor-data";
import {
    Button, Container, Segment,
    Header, Message, List, Form,
    Icon, Card, ListItem, Rating,
    Divider, Image, Sidebar, Tab, ListContent, Checkbox,
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
                }
    );

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
                    // console.log(expy[0]);
                    let experiment = fetchedExperimentArray[0];
                    let exptRatings = experiment.ratings.filter(rating => rating.rating != "");
                    console.log(exptRatings);
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
                            // Comments.findOne({_id: "bkXE3GtYtkxW2q6Zt"});
                            id = comment._id;
                            body = comment.text;

                            setQuestionItem({
                                itemId: id,
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
                console.log(question);
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
        console.log(answerString, answerInt);
    }

    const submitAnswer = () => {
        //todo work out what submitting an answer looks like / does.
        if(answerString){
            console.log("question type was: ", typeOfQuestion);
            if(typeOfQuestion){
                console.log("a comment rating answer")
            } else {
                console.log("a personality question answer")
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
                    <List.Header as={'h4'}
                                 content={questionItem && questionItem.headerText}
                                 // content={aStub && aStub.headerText}
                    />
                    {questionItem.bodyText &&
                    <List.Description as={Segment}
                                      content={questionItem && questionItem.bodyText}
                    />
                    }
                    <hr/>
                    {questionItem.ratingLabels.map((label) =>
                        <Form.Field>
                            <Checkbox
                                key={label}
                                radio
                                label={label}
                                name='quixbox'
                                value={label}
                                checked={answerString === label}
                                // onChange={({target}) => addAnswerValue(target.value)}
                                onChange={(e, data) => addAnswerValue(data.value)}
                            />
                        </Form.Field>
                    )}
                    <p style={{color:'red', height:"10px"}}>{submitErr && submitErr}</p>
                    <Button content={'Submit Answer'} onClick={submitAnswer}/>
                    <Button content={'Different Question'} onClick={updateQuestion}/>
                </ListContent>
            </ListItem>
        </div>
    )
}
