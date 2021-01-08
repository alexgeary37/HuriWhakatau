import Cookies from "universal-cookie/lib";
import React, {useEffect, useState} from "react";
import {
    Container, Segment, Header, Grid,
    GridColumn, GridRow, Sidebar, Divider, Tab,
} from "semantic-ui-react";
import {NavBar} from "./NavBar";
import {siteGlossary} from "../../api/glossary";
import {Sidebars} from "./Sidebars";
import {Link} from "react-router-dom";
import {Layout} from "./Layout";

export const FAQ = () => {
    useEffect(()=>{document.title = "FAQ"},[])

    const faqPagContent = (userLang) =>{
        return(
            <Container textAlign='left'>
                <Segment attached="top" clearing inverted
                         style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
                    <Header size="huge">
                        <Header.Content as={Container}>
                            {siteGlossary.siteName[userLang] + ' Frequently Asked Questions'}<span
                            title={'Not really. Just what we think you might ask'}>*</span>
                        </Header.Content>
                    </Header>
                    <Divider/>
                    <Tab menu={{inverted: true}} panes={[
                        {
                            menuItem: 'For Participants', render: () =>
                                <Tab.Pane inverted style={{border: 'none'}}>
                                    <Header inverted>What is a "Discussion"?</Header>
                                    <p>A discussion is where you will talk about a selected topic with your
                                        group.
                                        The key
                                        features of a discussion are the topic, comments and verdicts.</p>
                                    <Header inverted>There's a list of names to the right of the discussion
                                        comments, what's
                                        up with that?</Header>
                                    <p>This is the list of discussion participants, here is where you can vote
                                        on a
                                        group
                                        leader, see each other's pepeha information (if filled out on the User
                                        Settings
                                        page) and can choose an emoji to represent how you are feeling at any
                                        time.</p>
                                    <Header inverted>Wait, people can see how I'm feeling!?</Header>
                                    <p>Not everyone, no. Just you and the group leader can see the colours added
                                        by
                                        the
                                        emojis. The colours will also reste after about 3 minutes so you aren't
                                        registered
                                        as being angry for the whole discussion.</p>
                                    <Header inverted>What does a group leader do?</Header>
                                    <p>In your initial introductory discussion you will vote on a group leader.
                                        This
                                        person
                                        will take on the role of discussion moderator, they will try to keep
                                        things
                                        moving,
                                        on topic and respectful. To aid in this they are the ones that can
                                        propose
                                        verdicts
                                        to be voted on by the other group members, they will be able to see your
                                        selected
                                        emotional state and they can finish discussions.</p>
                                </Tab.Pane>
                        },
                        {
                            menuItem: "For Researchers", render: () =>
                                <Tab.Pane inverted style={{border: 'none'}}>
                                    <Header inverted>What are "Groups"?</Header>
                                    <p>Groups are the participating unit of a discussion or experiment. They are
                                        made up of users that are either assigned by a researcher or by
                                        participating in an open discussion.</p>
                                    <Header inverted>What are "Discussion Templates"?</Header>
                                    <p>A discussion template is where the parameters of a discussion are
                                        specified.
                                        There are a number of options (that will be) available to change and see
                                        the
                                        effect on the discussion. For example a discussion might have a time
                                        limit,
                                        allow emoji reactions to other comments, allow users to edit their own
                                        comments and more..</p>
                                    <Header inverted>What are "Scenarios"?</Header>
                                    <p>Scenarios are basically the combination of a discussion topic with a
                                        discussion
                                        template. These scenarios can then be reused in different combinations
                                        to
                                        see the how the surrounding discussions or the particular group of users
                                        change the results.</p>
                                    <Header inverted>What are "Scenarios Sets"?</Header>
                                    <p>A Scenario set simply collects a number of scenarios so that a chained
                                        set of
                                        discussions can be set up for the same group of users. There may be any
                                        number of scenarios in a set.</p>
                                    <Header inverted>What are "Experiments"?</Header>
                                    <p>Experiments bring all the preceding components together. Select a group
                                        and
                                        Scenario set specify if there will be free chat "introduction"
                                        discussion
                                        and an introductory comment to kick things off.</p>
                                    <p>Additionally, you may specify up to 5 comment rating questions for the
                                        experiment. This will pair one comment from the discussions with the
                                        question and display on a user's Dashboard to get a subjective rating of
                                        the
                                        comment on a set of predefined Likert scale ratings.</p>
                                    <Header inverted>How do I invite users to participate?</Header>
                                    <p>On your dashboard there is an "Add User" button that will allow you to
                                        invite specific user to the site. You can choose what roles they may
                                        have.
                                        They will need to validate their account before participating.</p>
                                    <Header inverted>What is a "HuiChat"?</Header>
                                    <p>A HuiChat is a discussion format specifically designed for Maori users.
                                        It is
                                        an attempt to replicate various cultural practices in an online
                                        environment.
                                        The defining characteristics of a HuiChat type discussion is that
                                        HuiChats <b>must</b> have an introduction discussion where the group can
                                        vote on a leader.</p>
                                    <p>This leader will then be the only person able to propose verdicts and
                                        decide when the discussion is complete. Group leaders will also be able
                                        to
                                        see the emotional state of participants if they use the emoji next to
                                        their
                                        name in the participant list. Also HuiChats will display the user's
                                        pepeha
                                        information via hover text associated with their names in the
                                        participant
                                        list.</p>
                                </Tab.Pane>
                        }]}/>
                </Segment>
            </Container>
        );
    }

    return (
        // <Segment inverted
        //          textAlign='center'
        //          style={{minHeight: 800, padding: '1em 0em'}}
        //          vertical>
        //     <NavBar handleChangeLanguage={handleChangeLanguage}/>
        //     <Sidebar.Pushable as={Segment} style={{height: '90vh', backgroundColor: 'rgb(30,30,30)'}}>
                <Layout page={faqPagContent}/>
                // {/*<Sidebars/>*/}
                // {/*<Sidebar.Pusher style={{backgroundColor: 'rgb(10, 10, 10)', overflow: "auto", height: "92vh"}}>*/}
                //     {/*<Container textAlign='left'>*/}
                //     {/*    <Segment attached="top" clearing inverted*/}
                //     {/*             style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>*/}
                //     {/*        <Header size="huge">*/}
                //     {/*            <Header.Content as={Container}>*/}
                //     {/*                {siteGlossary.siteName[userLang] + ' Frequently Asked Questions'}<span*/}
                //     {/*                title={'Not really. Just what we think you might ask'}>*</span>*/}
                //     {/*            </Header.Content>*/}
                //     {/*        </Header>*/}
                //     {/*        <Divider/>*/}
                //     {/*        <Tab menu={{inverted: true}} panes={[*/}
                //     {/*            {*/}
                //     {/*                menuItem: 'For Participants', render: () =>*/}
                //     {/*                    <Tab.Pane inverted style={{border: 'none'}}>*/}
                //     {/*                        /!* <Grid>*!/*/}
                //     {/*                        /!* <Header inverted>For Participants</Header>*!/*/}
                //     {/*                        /!*<GridRow columns={1}>*!/*/}
                //     {/*                        /!*    <GridColumn width={16}>*!/*/}
                //     {/*                        <Header inverted>What is a "Discussion"?</Header>*/}
                //     {/*                        <p>A discussion is where you will talk about a selected topic with your*/}
                //     {/*                            group.*/}
                //     {/*                            The key*/}
                //     {/*                            features of a discussion are the topic, comments and verdicts.</p>*/}
                //     {/*                        <Header inverted>There's a list of names to the right of the discussion*/}
                //     {/*                            comments, what's*/}
                //     {/*                            up with that?</Header>*/}
                //     {/*                        <p>This is the list of discussion participants, here is where you can vote*/}
                //     {/*                            on a*/}
                //     {/*                            group*/}
                //     {/*                            leader, see each other's pepeha information (if filled out on the User*/}
                //     {/*                            Settings*/}
                //     {/*                            page) and can choose an emoji to represent how you are feeling at any*/}
                //     {/*                            time.</p>*/}
                //     {/*                        <Header inverted>Wait, people can see how I'm feeling!?</Header>*/}
                //     {/*                        <p>Not everyone, no. Just you and the group leader can see the colours added*/}
                //     {/*                            by*/}
                //     {/*                            the*/}
                //     {/*                            emojis. The colours will also reste after about 3 minutes so you aren't*/}
                //     {/*                            registered*/}
                //     {/*                            as being angry for the whole discussion.</p>*/}
                //     {/*                        <Header inverted>What does a group leader do?</Header>*/}
                //     {/*                        <p>In your initial introductory discussion you will vote on a group leader.*/}
                //     {/*                            This*/}
                //     {/*                            person*/}
                //     {/*                            will take on the role of discussion moderator, they will try to keep*/}
                //     {/*                            things*/}
                //     {/*                            moving,*/}
                //     {/*                            on topic and respectful. To aid in this they are the ones that can*/}
                //     {/*                            propose*/}
                //     {/*                            verdicts*/}
                //     {/*                            to be voted on by the other group members, they will be able to see your*/}
                //     {/*                            selected*/}
                //     {/*                            emotional state and they can finish discussions.</p>*/}
                //     {/*                        /!* </GridColumn>*!/*/}
                //     {/*                        /!* </GridRow>*!/*/}
                //     {/*                    </Tab.Pane>*/}
                //     {/*            },*/}
                //     {/*            {*/}
                //     {/*                menuItem: "For Researchers", render: () =>*/}
                //     {/*                    <Tab.Pane inverted style={{border: 'none'}}>*/}
                //     {/*                        /!*<Header inverted>For Researchers</Header>*!/*/}
                //     {/*                        /!* <GridRow columns={1}>*!/*/}
                //     {/*                        /!*     <GridColumn width={16}>*!/*/}
                //     {/*                        <Header inverted>What are "Groups"?</Header>*/}
                //     {/*                        <p>Groups are the participating unit of a discussion or experiment. They are*/}
                //     {/*                            made up of users that are either assigned by a researcher or by*/}
                //     {/*                            participating in an open discussion.</p>*/}
                //     {/*                        <Header inverted>What are "Discussion Templates"?</Header>*/}
                //     {/*                        <p>A discussion template is where the parameters of a discussion are*/}
                //     {/*                            specified.*/}
                //     {/*                            There are a number of options (that will be) available to change and see*/}
                //     {/*                            the*/}
                //     {/*                            effect on the discussion. For example a discussion might have a time*/}
                //     {/*                            limit,*/}
                //     {/*                            allow emoji reactions to other comments, allow users to edit their own*/}
                //     {/*                            comments and more..</p>*/}
                //     {/*                        <Header inverted>What are "Scenarios"?</Header>*/}
                //     {/*                        <p>Scenarios are basically the combination of a discussion topic with a*/}
                //     {/*                            discussion*/}
                //     {/*                            template. These scenarios can then be reused in different combinations*/}
                //     {/*                            to*/}
                //     {/*                            see the how the surrounding discussions or the particular group of users*/}
                //     {/*                            change the results.</p>*/}
                //     {/*                        <Header inverted>What are "Scenarios Sets"?</Header>*/}
                //     {/*                        <p>A Scenario set simply collects a number of scenarios so that a chained*/}
                //     {/*                            set of*/}
                //     {/*                            discussions can be set up for the same group of users. There may be any*/}
                //     {/*                            number of scenarios in a set.</p>*/}
                //     {/*                        <Header inverted>What are "Experiments"?</Header>*/}
                //     {/*                        <p>Experiments bring all the preceding components together. Select a group*/}
                //     {/*                            and*/}
                //     {/*                            Scenario set specify if there will be free chat "introduction"*/}
                //     {/*                            discussion*/}
                //     {/*                            and an introductory comment to kick things off.</p>*/}
                //     {/*                        <p>Additionally, you may specify up to 5 comment rating questions for the*/}
                //     {/*                            experiment. This will pair one comment from the discussions with the*/}
                //     {/*                            question and display on a user's Dashboard to get a subjective rating of*/}
                //     {/*                            the*/}
                //     {/*                            comment on a set of predefined Likert scale ratings.</p>*/}
                //     {/*                        <Header inverted>How do I invite users to participate?</Header>*/}
                //     {/*                        <p>On your dashboard there is an "Add User" button that will allow you to*/}
                //     {/*                            invite specific user to the site. You can choose what roles they may*/}
                //     {/*                            have.*/}
                //     {/*                            They will need to validate their account before participating.</p>*/}
                //     {/*                        <Header inverted>What is a "HuiChat"?</Header>*/}
                //     {/*                        <p>A HuiChat is a discussion format specifically designed for Maori users.*/}
                //     {/*                            It is*/}
                //     {/*                            an attempt to replicate various cultural practices in an online*/}
                //     {/*                            environment.*/}
                //     {/*                            The defining characteristics of a HuiChat type discussion is that*/}
                //     {/*                            HuiChats <b>must</b> have an introduction discussion where the group can*/}
                //     {/*                            vote on a leader.</p>*/}
                //     {/*                        <p>This leader will then be the only person able to propose verdicts and*/}
                //     {/*                            decide when the discussion is complete. Group leaders will also be able*/}
                //     {/*                            to*/}
                //     {/*                            see the emotional state of participants if they use the emoji next to*/}
                //     {/*                            their*/}
                //     {/*                            name in the participant list. Also HuiChats will display the user's*/}
                //     {/*                            pepeha*/}
                //     {/*                            information via hover text associated with their names in the*/}
                //     {/*                            participant*/}
                //     {/*                            list.</p>*/}
                //     {/*                        /!* </GridColumn>*!/*/}
                //     {/*                        /!*</GridRow>*!/*/}
                //     {/*                        /!* </Grid>*!/*/}
                //     {/*                    </Tab.Pane>*/}
                //     {/*            }]}/>*/}
                //     {/*    </Segment>*/}
                //     {/*</Container>*/}
                //  {/*</Sidebar.Pusher>*/}
        //     </Sidebar.Pushable>
        // </Segment>
    )
}
