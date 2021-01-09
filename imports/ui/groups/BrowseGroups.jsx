import React from "react";
import {useTracker} from "meteor/react-meteor-data";
import {Link} from "react-router-dom";
import {
    Button, Container, Segment, List,
} from "semantic-ui-react";
import {Groups} from "/imports/api/groups";
import {NavBar} from "/imports/ui/navigation/NavBar";

export const BrowseGroups = () => {
    const {groups} = useTracker(() => {
        Meteor.subscribe("groups");

        return {
            groups: Groups.find().fetch(),
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
                        to="/groups/create"
                        color="green"
                    />
                </Segment>
                <List as={Segment} attached="bottom" divided relaxed="very">
                    {groups &&
                    groups.map((group) => (
                        <List.Item
                            style={{padding: 15}}
                            key={group._id}
                            as={Link}
                            to={`/groups/${group._id}`}
                        >
                            <List.Content header={group.name ? group.name : group._id}/>
                        </List.Item>
                    ))}
                </List>
            </Container>
        </div>
    );
};
