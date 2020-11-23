import React, { useState } from "react";
import { Random } from 'meteor/random'
import {indices, responseSet} from '/imports/api/ratingResponses'
import {useTracker} from "meteor/react-meteor-data";
import {
    Button, Container, Segment,
    Header, Message, List, Form,
    Icon, Card, ListItem, Rating,
    Divider, Image, Sidebar, Tab, ListContent, Checkbox,
} from "semantic-ui-react";
import {Comments} from "/imports/api/comments";
import {Experiments} from "../../api/experiments";
import {Personality} from "../../api/personality";
import Cookies from "universal-cookie/cjs/Cookies";

export const RatingComponent = () => {
    const [answerInt, setAnswerInt] = useState(0);
    const [answerString, setAnswerString] = useState("");

    /*
    * intent:
    * if comment rating:
    * retrieve ratings and discussion ids from random experiment where experiment.ratings[0].rating != ""
    * From ratings array randomly choose one where rating != ""
    * From discussions array in experiment choose random id.
    * Retrieve random comment where discussion id matches randomly chosen id.
    * Retrieve ratings set where type === ratings.responseType
    *
    *
    * if personality question rating:
    * get random personality question from random personality quiz document
    *
    * get the indices for the response set for the scale set & generate rating range label set from the ratings
    * set and the indices (eg scale = 2, responseSetIndices = indices[scale]
    * for responseSetIndices labelSet.push(responseSet[index]))
    *
    * questionItem object = {
    *   itemId: comment ? comment._id : question._id,
    *   itemNumber: comment ? 0 : question.item,
    *   headerText: comment ? rating.rating : question.text,
    *   bodyText: comment ? comment.text : "",
    *   scale: rating.scale,
    *   reverse: rating.reverse,
    *   ratingLabels: labelSet,
    * }
    * */
    // cut down personality question for testing. should be in a collection and retrieved randomly.

    const {questionItem} = useTracker(() => {
        const [collection, type] = Random.choice([[Experiments, 1], [Personality, 0]]);
        const collectionSub = type ? Meteor.subscribe("experiments") : Meteor.subscribe("personality");
        // item variables. may be condensed / modified later.
        let rating;
        let responseIndices;
        let responses;
        let labelSet = [];
        let comment;
        let question;
        let id="";
        let itemNum=0;
        let header="";
        let body="";
        let ratingScale=7;
        let ratingReverse=false;
        if(collectionSub.ready()){
            if(type){
                // get experiment,todo change this so it's while random experiment.ratings.rating === "" get random
                //  expt. like the random username rather than the one expt I know works.
                const experiment = collection.findOne({_id: "aEwAZuSd32fzaWYWz"});
                if(experiment.ratings) {
                    // for the moment get number of ratings the at != "",
                    // todo change the submit expt so ratings === "" are not submitted.

                    let exptRatings = experiment.ratings.filter( rating => rating.rating != "");
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
                    // get comment
                    let commentSub = Meteor.subscribe("comments");
                    if (commentSub.ready()) {
                        // get a random comment for a discussion in the experiment.
                        // comment = Comments.find({discussionId: {$in: experiment.discussions}}).fetch();
                        comment = Comments.findOne({_id:"bkXE3GtYtkxW2q6Zt"});
                        id = comment._id;
                        body = comment.text;
                    }
                }
            } else {
                const personalityQuestionnaire = collection.findOne({_id:"eEg6qCkMPsBq53khD"});
                if(personalityQuestionnaire.items) {
                    question = personalityQuestionnaire.items[Math.floor(
                        Math.random() * Math.floor(personalityQuestionnaire.items.length))];
                    // question = personalityQ;
                    itemNum = question.item;
                    header = question.text;
                    body = "";
                    ratingScale = question.scale;
                    ratingReverse = question.scoringReversed;
                    responses = responseSet.find(set => set.responseType === question.responseType)
                    responseIndices = indices[ratingScale];
                    // get the appropriate labels given the number of responses set eg 2, 5 or 7
                    responseIndices.forEach(index => labelSet.push(responses.fullRange[index]));
                }
            }
        }

        return {
            questionItem:{
                itemId: id,
                itemNumber: itemNum,
                headerText: header,
                bodyText: body,
                scale: ratingScale,
                reverse: ratingReverse,
                ratingLabels: labelSet,
            }
        };
    })

    // todo work out what submitting an answer looks like / does.
    const addAnswerValue = (value) => {
        // if reverse coding is active.
        // score = ratingLabels.indexOf(value) if reverse is false, else ratingLabels.reverse().indexOf(value).

        setAnswerString(value);
        setAnswerInt(item.range.indexOf(value)),
        console.log(answerString, answerInt);
    }

    const submitAnswer = () => {

    }

    return (
        <div>
            <Header as={'h3'} content={"question"} inverted/>
            <ListItem key={'akey'}>
                <ListContent as={Segment} style={{
                    backgroundColor: "#c4c4c4",
                }}>
                    <List.Header as={'h4'} content={questionItem && questionItem.headerText} />
                    {questionItem.bodyText &&
                    <List.Description as={Segment}
                                      content={questionItem && questionItem.bodyText}
                    />
                    }
                    <hr/>
                        {/*<input type="range" min="0" max={item.scale - 1} value={answer} name={ratingInfo.type} id={item._id + "#" + item.item}*/}
                        {/*       onChange={({target}) => addAnswerValue(target.value)}/>*/}
                    {questionItem.ratingLabels.map((label) =>
                        <Form.Field>
                        <Checkbox
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
                    <Button content={'Submit Answer'} onClick={submitAnswer}/>
                </ListContent>
            </ListItem>
        </div>
    )
}

