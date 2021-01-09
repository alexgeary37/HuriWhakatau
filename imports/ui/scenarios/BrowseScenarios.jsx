import React from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Link} from "react-router-dom";
import {
    Container, Segment, List, Button,
} from "semantic-ui-react";
import {Scenarios} from "/imports/api/scenarios";
import {NavBar} from "/imports/ui/navigation/NavBar";

export const BrowseScenarios = () => {
    const {scenarios} = useTracker(() => {
        Meteor.subscribe("scenarios");

        return {
            scenarios: Scenarios.find().fetch(),
        };
    });

    return (
        <div>
            <NavBar/>
            <Container>
                <Segment attached="top" clearing>
                    <Button
                        content="Create New"
                        as={Link}
                        to="/scenarios/create"
                        color="green"
                    />
                </Segment>
                <List as={Segment} attached="bottom" divided relaxed="very">
                    {scenarios &&
                    scenarios.map((scenario) => (
                        <List.Item
                            style={{padding: 15}}
                            key={scenario._id}
                            as={Link}
                            to={`/scenarios/${scenario._id}`}
                        >
                            <List.Content
                                header={scenario.title}
                                content={scenario.description}
                            />
                        </List.Item>
                    ))}
                </List>
            </Container>
        </div>
    );
};
