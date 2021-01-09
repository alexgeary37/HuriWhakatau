import React, {useState} from "react";
import {Button, Label} from "semantic-ui-react";

export const Timer = ({time}) => {
    const [title, setTitle] = useState(<span>&nbsp;&nbsp;&nbsp;Time left&nbsp;&nbsp;&nbsp;&nbsp;</span>);
    const handleTouch = () => {
        setTitle(<span>Don't touch</span>);


        Meteor.setTimeout(() => setTitle(<span>&nbsp;&nbsp;&nbsp;Time left&nbsp;&nbsp;&nbsp;&nbsp;</span>), 300);
    }
    return (
        //probably a better way to format this but a button looks fine for now.
        <div>
            <Button id={"timerButton"} as='div' labelPosition='left' onClick={handleTouch}>
                <Label basic color={"green"} disabled>
                    {title}
                </Label>
                <Button color={"green"} disabled>
                    {time}
                </Button>
            </Button>
        </div>
    );
};
