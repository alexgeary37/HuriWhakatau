import React, {useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {
    Input,
    Button,
    Label,
    Card,
    Container,
    Segment,
    Header,
    List,
    Icon,
    Divider,
    Form,
    Grid,
    GridColumn, GridRow, CardHeader, CardContent
} from "semantic-ui-react";
import {NavBar} from "/imports/ui/navigation/NavBar";

export const UserSettings = () => {
    // useTracker makes sure the component will re-render when the data changes.
    const {user} = useTracker(() => {
        Meteor.subscribe("users");
        return {
            user: Meteor.users.findOne({_id: Meteor.userId()}),
        };
    });

    const [userMountain, setUserMountain] = useState("");

    console.log("mountain: ", userMountain);

    return (
        <div>
            <NavBar />
            <Container>
                <Segment attached="top" clearing>
                    <Header size="huge">
                        <Header.Content as={Container} fluid>
                            My Account - {user && user.username}
                        </Header.Content>
                    </Header>
                </Segment>
                <Grid  columns={2}>
                    <GridColumn width={9}>
                        <Card>
                            <CardHeader as="h4">
                                Account Details
                            </CardHeader>
                            <CardContent>
                                <Form>
                                    <Input labelPosition="left"
                                           type="text"
                                           value={user && user.username}
                                           readOnly
                                           size="mini"
                                           style={{width:"45%"}}>
                                        <Label>Username</Label>
                                           <input />
                                    <Button size="mini" content="Change"/>
                                    </Input>


                                </Form>
                                content
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                some other stuff
                            </CardHeader>
                            <CardContent>


                            </CardContent>
                        </Card>
                    </GridColumn>
                    {/*<GridColumn width={5}>*/}

                    {/*</GridColumn>*/}
                    <GridColumn width={7}>
                        <Card>
                        <CardHeader>
                            Pepeha
                        </CardHeader>
                            <CardContent>
                                <Form>
                                    <Input value={userMountain}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width:"45%"}}
                                           onInput={({target}) => setUserMountain(target.value)}
                                    >
                                    <Label style={{width:"55%"}}>Mountain</Label>
                                        <input />
                                        <Button icon style={{marginLeft:"20px"}}>
                                            <Icon className="mountain" />
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={userMountain}
                                                   labelPosition="left"
                                                   type="text"
                                                   size="mini"
                                                   style={{width:"45%"}}
                                                   onInput={({target}) => setUserMountain(target.value)}
                                >
                                    <Label style={{width:"55%"}}>River</Label>
                                    <input />
                                    <Button icon style={{marginLeft:"20px"}}>
                                        <Icon className="river" />
                                    </Button>
                                </Input>
                                    <br/>
                                    <br/>
                                    <Input value={userMountain}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width:"45%"}}
                                           onInput={({target}) => setUserMountain(target.value)}
                                    >
                                        <Label style={{width:"55%"}}>Waka</Label>
                                        <input />
                                        <Button icon style={{marginLeft:"20px"}}>
                                            <Icon className="waka" />
                                        </Button>
                                    </Input>
                                    <br/>
                                    <br/>
                                    <Input value={userMountain}
                                           labelPosition="left"
                                           type="text"
                                           size="mini"
                                           style={{width:"45%"}}
                                           onInput={({target}) => setUserMountain(target.value)}
                                    >
                                        <Label style={{width:"55%"}}>Iwi</Label>
                                        <input />
                                        <Button icon style={{marginLeft:"20px"}}>
                                            <Icon className="iwi" />
                                        </Button>
                                    </Input>

                                </Form>
                            </CardContent>
                        </Card>
                    </GridColumn>
                </Grid>
            </Container>
        </div>
    );
}
