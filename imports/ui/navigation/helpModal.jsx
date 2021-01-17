import React, { useState } from "react";
import {
    Modal,
    Button,
    Icon,
} from "semantic-ui-react";

export const HelpModal = (text) => {
    const [open, setOpen] = useState(false)
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='tiny'
            trigger={<Icon name='help circle' color='blue' style={{margin:"2px"}}/>}
        >
            <Modal.Content>
                {text.text}
            </Modal.Content>
            <Button content='Close' color='black' onClick={() => setOpen(false)} style={{margin:"20px"}}/>
        </Modal>
    )
}
