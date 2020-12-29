import React, {useState} from "react";
import {Container, Segment, Form} from "semantic-ui-react";
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

            Meteor.loginWithToken(token, function(loginTokenErr) {
                if (loginTokenErr) {
                    setConfirmationColour("red");
                    setConfirmationResult("Error: There was something wrong with the confirmation token. " +
                        "Please try agian");
                } else {
                    setConfirmationColour("blue");
                    setConfirmationResult("Email confirmed, you should receive your data shortly. " +
                        "Redirecting to user settings page")
                    Meteor.call("users.exportUserData", userId);
                    Meteor.setTimeout(()=>{
                        history.push('/UserSettings');
                    }, 4000);
                }
            });
            return;
        };
    }


    return (
        <div>
            <NavBar/>
            <Container>
                <Form as={Segment} attached="bottom">
                    <p>Please click the button below to confirm your identity and start the export process.</p>

                    {confirmationResult ? (
                        <div style={{height: "25px", color: confirmationColour}}>{confirmationResult}</div>
                    ) : (
                        <div style={{height: "25px"}}/>
                    )}

                    <Form.Button
                        content="Confirm"
                        onClick={() => {
                            handleConfirmation()
                        }
                        }
                    />
                </Form>
            </Container>
        </div>
    );
};
