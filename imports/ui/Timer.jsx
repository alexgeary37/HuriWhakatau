import React from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Link} from "react-router-dom";
import {List, Segment} from "semantic-ui-react";
import {Scenarios} from "/imports/api/scenarios";

export const Timer = ({time}) => {

    return (
        <List.Item>
            <List.Content as={Segment}>
                <List.Header content={time}/>
            </List.Content>
        </List.Item>
    );
};
