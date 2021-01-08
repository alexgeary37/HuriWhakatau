import React, {useEffect, useState} from "react";
import {useTracker} from "meteor/react-meteor-data";
import {
    Container, Segment, Header, List,
    Grid, GridColumn, GridRow
} from "semantic-ui-react";
import {dashSplash} from "../../api/tourSteps";
import {siteGlossary} from "../../api/glossary";
import {Discussions} from "/imports/api/discussions";
import {Tour} from "./Tour";
import {DiscussionSummary} from "/imports/ui/discussions/DiscussionSummary";
import Cookies from "universal-cookie/lib";
import {Layout} from "./Layout";

export const Dashboard = () => {
    const cookies = new Cookies();
    const [showTour, setShowTour] = useState(false);
    //set up tour of page
    const splashTourSteps = dashSplash;

    useEffect(()=>{document.title = "Home"},[])

    const toggleShowTour = () => {
        if (!cookies.get('signup')) {
            setShowTour(!showTour);
        }
    }

    useEffect(() => {
        toggleShowTour();
    }, []);


    const {discussions, publicDiscussions} = useTracker(() => {
        Meteor.subscribe("allDiscussions");

        return {
            user: Meteor.userId(),
            discussions: Discussions.find(
                {status: {$ne: "active"}},
                {sort: {createdAt: -1}}
            ).fetch(),
            publicDiscussions: Discussions.find(
                {$and: [{status: "active"}, {isPublic: {$eq: true}}]},
                {sort: {createdAt: -1}}
            ).fetch(),
        };
    });

    const dashboardPageContent = (userLang) =>{
        return(
            <Container inverted={'true'}>
                {showTour && <Tour TOUR_STEPS={splashTourSteps}/>}
                {/*header from semantic ui layout example*/}
                <Container text>
                    <Header
                        as={'h1'}
                        content={siteGlossary.siteWelcome[userLang] + " " + siteGlossary.siteName[userLang]}
                        inverted
                        style={{
                            fontSize: '4em',
                            fontWeight: 'normal',
                            marginBottom: 0,
                            marginTop: '1.5em',
                        }}
                    />
                    <Header
                        as={'h2'}
                        content={'Jump in, the discussions are fine'}
                        inverted
                        style={{
                            fontSize: '1.7em',
                            fontWeight: 'normal',
                            marginTop: '1.5em',
                        }}
                    />
                </Container>
                {/*End of semantic example header */}
                <Segment style={{padding: '6em 0em'}} vertical>
                    <Grid container stackable verticalAlign='middle'>
                        <GridRow>
                            <GridColumn>
                                <Segment inverted attached="top"
                                         style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
                                    <Header as={'h3'}
                                            content={"Public " + siteGlossary.userDiscourse[userLang]}/>
                                    <List relaxed size="huge" style={{overflow: "auto", height: "40vh"}}>
                                        {publicDiscussions &&
                                        publicDiscussions.map((discussion) => (
                                            <DiscussionSummary
                                                key={discussion._id}
                                                discussion={discussion}
                                            />
                                        ))}
                                    </List>
                                </Segment>
                                <Segment inverted attached="top"
                                         style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
                                    <Header as={'h3'}
                                            content={"Finished " + siteGlossary.userDiscourse[userLang]}/>
                                    <List relaxed size="huge" style={{overflow: "auto", height: "40vh"}}>
                                        {discussions &&
                                        discussions.map((discussion) => (
                                            <DiscussionSummary
                                                key={discussion._id}
                                                discussion={discussion}
                                            />
                                        ))}
                                    </List>
                                </Segment>
                            </GridColumn>
                        </GridRow>
                    </Grid>
                </Segment>
            </Container>
        );
    }

    //noinspection JSNonASCIINames
    return (
                <Layout page={dashboardPageContent}/>
    );
};
