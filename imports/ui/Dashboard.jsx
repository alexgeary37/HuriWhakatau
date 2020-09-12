import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {
    Button,
    Container,
    Segment,
    Header,
    Message,
    List,
    Icon,
    Divider,
} from "semantic-ui-react";
import {Discussions} from "/imports/api/discussions";
import {NavBar} from "./NavBar";
import {DiscussionSummary} from "./DiscussionSummary";
import {LoginForm} from "./LoginForm";

export const Dashboard = () => {
    const [showInfo, setShowInfo] = useState(true);

    const {user, discussions} = useTracker(() => {
        Meteor.subscribe("allDiscussions");

        return {
            user: Meteor.userId(),
            discussions: Discussions.find({status: {$ne: "active"}}, {sort: {status: 1}}).fetch(),
        };
    });

    if (!user) {
        return (
            <div className="dashboard-login">
                <LoginForm/>
            </div>
        );
    }

    return (
        <div>
            <NavBar/>
            <Container>
                {/* ########################################################################
        Display 'Dashboard' and '?' */}
                <Segment attached="top" clearing>
                    <Header size="huge">
                        <Header.Content as={Container} fluid>
                            <Button
                                floated="right"
                                circular
                                color="blue"
                                size="large"
                                icon="help"
                                onClick={() => setShowInfo(!showInfo)}
                            />
                            Dashboard
                        </Header.Content>
                    </Header>
                    <Message
                        size="large"
                        info
                        floating
                        hidden={!showInfo}
                        onDismiss={() => setShowInfo(false)}
                    >
                        {/* ########################################################################
            Display everything in the blueish box */}
                        <Message.Header>
                            <Icon name="help circle" size="big"/> About JuryRoom
                        </Message.Header>
                        <Divider horizontal hidden/>
                        <Message.Content>
                            JuryRoom is a digital environment designed to host discussions
                            with a focus on reaching a consensus.
                        </Message.Content>
                        <Message.Content>
                            You will participate in a sequence of discussions, and must reach
                            a consensus as a group before proceeding to the next discussion
                            topic.
                        </Message.Content>
                        <Message.List>
                            <Message.Item>
                                Participate in discussions by posting comments.
                            </Message.Item>
                            <Message.Item>Verdict</Message.Item>
                            <Message.Item>
                                When a verdict is proposed, indicate whether you affirm or
                                reject the verdict. If everyone agrees, the discussion is
                                closed.
                            </Message.Item>
                            <Message.Item>
                                If the group is unable to reach a consensus within the
                                discussion's time limit, a 'hung jury' will be declared.
                            </Message.Item>
                        </Message.List>
                        <Divider horizontal hidden/>
                    </Message>
                </Segment>

                <Segment attached="bottom">
                    <Header content="Discussions"/>
                    <Segment attached="top" clearing>
                        <List relaxed size="huge">
                            {discussions &&
                            discussions.map((discussion) => (
                                <DiscussionSummary
                                    key={discussion._id}
                                    discussion={discussion}
                                />
                            ))}
                        </List>
                    </Segment>
                </Segment>
            </Container>
        </div>
    );
};
