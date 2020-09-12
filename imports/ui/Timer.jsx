import React from "react";
import {List, Segment, Button} from "semantic-ui-react";

export const Timer = ({time}) => {

    return (
        //probably a better way to format this but a button looks fine for now.
        <Button color={'green'} content={time} disabled/>
        // <List.Item>
        //     <List.Content as={Segment}>
        //         <List.Header content={time}/>
        //     </List.Content>
        // </List.Item>
    );
};
