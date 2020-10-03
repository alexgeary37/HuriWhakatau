import React from "react";
import {Button, Label} from "semantic-ui-react";

export const Timer = ({time}) => {
    return (
        //probably a better way to format this but a button looks fine for now.
        <div>
            <Button as='div' labelPosition='left'>
                <Label basic color={"green"} disabled>
                    Time left
                </Label>
                <Button color={"green"} disabled>
                    {time}
                </Button>
            </Button>
        </div>
    );
};
