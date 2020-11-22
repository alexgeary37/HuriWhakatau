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

    const personalityQ = {
        _id: "chchgvkuytuvjhgjhkvn",
        questionnaireName: "Revised Dogmatism Scale",
        paperDoi: "10.1080/01463370600877950",
        items:   [
                        {	item: 1,
                            text: "There is a clear line between what is right and what is wrong.",
                            scale: 5,
                            scoringReversed: false,
                            responseType: "Accuracy", },]
        }

    const {questionItem} = useTracker(() => {
        const [collection, type] = Random.choice([[Experiments, 1], [Experiments, 1]]);
        const collectionSub = type ? Meteor.subscribe("experiments") : Meteor.subscribe("experiments");

        let fetchedItem;
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
            fetchedItem = collection.find({}).fetch()[0];
            if(type){
                // get experiment
                const experiment = Experiments.findOne({_id: "aEwAZuSd32fzaWYWz"});
                if(experiment.ratings) {
                    rating = experiment.ratings[0];
                    responses = responseSet.find(set => set.type === rating.response)
                    ratingScale = rating.scale;
                    ratingReverse = rating.reverse;
                    responseIndices = indices[ratingScale];
                    console.log("responses", responses);
                    console.log("responseIndices", responseIndices);
                    responseIndices.forEach(index => labelSet.push(responses.fullRange[index]));
                    header = rating.rating;
                    // get comment
                    let commentSub = Meteor.subscribe("comments");
                    if (commentSub.ready()) {
                        // comment = Comments.find({discussionId: {$in: experiment.discussions}}).fetch();
                        comment = Comments.findOne({_id:"bkXE3GtYtkxW2q6Zt"});
                        console.log("comment", comment);
                        body = comment.text;
                        console.log("body", body);
                    }
                }
            } else {
                question = personalityQ;
                itemNum = question.items.item;
                console.log(question);
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

    if(questionItem.ratingLabels){
        console.log(questionItem.ratingLabels);
    }
    // this is just info
    // const ratingInfo = {
    //     type: "Support",
    //     fullRange: ["Strongly oppose", "Somewhat oppose", "Slightly oppose", "neutral", "Slightly favor", "Somewhat favor",
    //             "Strongly favor"],
    //     range: "Strongly oppose - Strongly favor",
    //     scale:2,
    //     indices:[1,6],
    //     reverse: false,
    // }

    const item = {
        _id:"idNum",
        item: 2,
        text:"text",
        scale: 2,
        indices:[0,6],
        reverse: false,
        range: ["Strongly oppose","Strongly favor"]
    }

    const addAnswerValue = (value) => {
        setAnswerString(value);
        setAnswerInt(item.range.indexOf(value)),
        console.log(answerString, answerInt);
    }


    return (
        <div>
            <Header as={'h3'} content={"question"} inverted/>
            <ListItem key={'akey'}>
                <ListContent as={Segment} style={{
                    backgroundColor: "#c4c4c4",
                }}>
                    <List.Header as={'h4'} content={questionItem && questionItem.headerText} />
                    <List.Description as={Segment}
                        content={questionItem && questionItem.bodyText}
                    />
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
                </ListContent>
            </ListItem>
        </div>
    )
}

