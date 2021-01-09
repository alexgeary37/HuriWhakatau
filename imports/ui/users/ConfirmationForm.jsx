import React, {useEffect, useState} from "react";
import {Container, Segment, Form, Icon, Grid} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {useHistory} from "react-router-dom";
import {useParams} from "react-router-dom";
import {Accounts} from "meteor/accounts-base";

export const ConfirmationForm = () => {
    const {token, userId} = useParams();
    const [confirmationResult, setConfirmationResult] = useState("");
    const [confirmationColour, setConfirmationColour] = useState("");
    let history = useHistory();

    const handleConfirmation = () => {
        if (token.length !== 0) {
            Accounts.verifyEmail(token, (err) => {
                if (err) {
                    setConfirmationColour("red");
                    setConfirmationResult("Error: There was something wrong with the confirmation token. " +
                        "Please try again");
                } else {
                    setConfirmationColour("blue");
                    setConfirmationResult("Email confirmed, you should receive your data shortly. " +
                        "Redirecting to user settings page")
                    Meteor.call("users.exportUserData", userId);
                    Meteor.setTimeout(() => {
                        history.push('/UserSettings');
                    }, 4000);
                }
            })
            return;
        }
        ;
    };

    useEffect(handleConfirmation, [])

    return (
        <div>
            <NavBar/>
            <Container>
                <Form as={Segment} fluid={'true'} style={{textAlign: "center"}}>
                    {!confirmationResult && <p>Verifying email, please wait...</p>}
                    <Icon size={'big'} name={!confirmationResult ? 'circle notch' : ''} loading/>
                    {confirmationResult ? (
                        <div style={{height: "25px", color: confirmationColour}}>{confirmationResult}</div>
                    ) : (
                        <div style={{height: "25px"}}/>
                    )}
                </Form>
            </Container>
        </div>
    );
};
