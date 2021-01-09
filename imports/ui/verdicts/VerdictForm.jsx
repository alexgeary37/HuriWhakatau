import React, {useState} from "react";
import {Modal, Button, Form} from "semantic-ui-react";

export const VerdictForm = ({discussionId}) => {
    const [verdict, setText] = useState("");

    return (
        <Modal open={true}
               closeOnDimmerClick={false}
               size="tiny">
            <Modal.Header>Propose a Verdict</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form>
            <textarea
                placeholder="Type your verdict here..."
                rows="3"
                autoFocus
                name="verdict"
                onChange={(e) => setText(e.currentTarget.value)}
            />
                    </Form>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content="Cancel"
                    color="black"
                    onClick={() =>
                        Meteor.call("discussions.removeProposer", discussionId)
                    }
                />
                <Button
                    content="Submit Verdict"
                    labelPosition="right"
                    icon="checkmark"
                    onClick={() =>
                        Meteor.call("verdicts.insert", verdict.trim(), discussionId)
                    }
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
};
