import React, {useEffect, useRef} from "react";
import {Sidebar, Container, Segment, Header, Button, Visibility, Grid, GridColumn} from "semantic-ui-react";
import {useTracker} from "meteor/react-meteor-data";
import {Comments} from "/imports/api/comments";
import {Comment} from "./Comment";
import {CommentForm} from "./CommentForm";
import {useParams} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

// '_id' here is equal to 'comment' in Comment.jsx onDeleteClick(comment) I think ???
const deleteComment = ({_id}) => Meteor.call("comments.remove", _id);

export const Discussion = () => {
    const filter = {};
    const {discussionId} = useParams();

    const {comments} = useTracker(() => {
        Meteor.subscribe("comments", discussionId);

        return {
            comments: Comments.find(filter, {sort: {postedTime: 1}}).fetch(),
        };
    });

    //creating a reference to the empty div at the bottom of comments
    //to auto-scroll to the end of the discussion.
    const commentsEndRef = useRef(null)
    const scrollToBottom = () => {
        commentsEndRef.current.scrollIntoView({behavior: "auto"})
    }
    useEffect(scrollToBottom, [comments]);

    return (
                <div className="juryroom">
                    <Header as='h2' attached='top'>
                        Discussion
                    </Header>
                    <Segment.Group horizontal attached={"true"}>
                    <Segment>LEFT Content</Segment>
                    <Segment className="comments-and-form">
                        <ul className="comments" style={{overflow: 'auto', maxHeight: '50em' }}>
                            {comments.map((comment) => (
                                <div className="commentContainer" key={comment._id}>
                                    <Comment
                                        key={comment._id}
                                        comment={comment}
                                        onDeleteClick={deleteComment}
                                    />
                                </div>
                            ))}
                            <div ref={commentsEndRef}/>
                        </ul>
                        <CommentForm discussionId={discussionId}/>
                    </Segment>
                        <Segment>RIGHT Content</Segment>
                    </Segment.Group>
                </div>


    );
};
