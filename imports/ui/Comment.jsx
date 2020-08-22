import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import classnames from "classnames";
import {Button} from "semantic-ui-react";

export const Comment = ({
                            comment,
                            onDeleteClick,
                            onSubmitEditClick,
                            onEditClick,
                        }) => {
    const [isEditing, setIsEditing] = useState(false);
    let classes = classnames("comment");

    if (Meteor.userId() === comment.authorId) {
        classes = classnames("comment usersComment");
    }

    // useTracker makes sure the component will re-render when the data changes.
    const {user} = useTracker(() => {
        Meteor.subscribe("users");

        return {
            user: Meteor.users.findOne({_id: comment.authorId}),
        };
    });


    return (
        <li className={classes} id={comment._id}
        >
            {/*<button onClick={() => onDeleteClick(comment)}>&times;</button>*/}
            <span className="authorName">{user && user.username} - </span>
            <span className="commentTime">{comment.postedTime.toDateString()}</span>
            <br/>
            <span id={comment._id + ":text"}>
        {comment.text}
      </span>
            <br/>
            <span>
        {isEditing
            ? <Button onClick={() => {
                onSubmitEditClick(comment);
                setIsEditing(false)
            }}
            >SAVE</Button>
            : <Button onClick={() => {
                onEditClick(comment);
                setIsEditing(true)
            }}
            >EDIT</Button>
        }
        </span>
        </li>
    );
};
