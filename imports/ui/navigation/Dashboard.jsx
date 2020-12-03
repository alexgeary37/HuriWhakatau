import React, {useEffect, useState} from "react";
import { useTracker } from "meteor/react-meteor-data";
import {
  Button,
  Container,
  Segment,
  Header,
  Message,
  List,
  Icon,
  Divider, Sidebar,
} from "semantic-ui-react";
import {dashSplash} from "../../api/tourSteps";
import {siteGlossary} from "../../api/glossary";
import { Discussions } from "/imports/api/discussions";
import { Tour } from "./Tour";
import { NavBar } from "/imports/ui/navigation/NavBar";
import { Sidebars } from "./Sidebars";
import { DiscussionSummary } from "/imports/ui/discussions/DiscussionSummary";
import Cookies from "universal-cookie/lib";

export const Dashboard = () => {
  const [userLang, setUserLang] = useState("mā");
  const cookies = new Cookies();
  //set up tour of page
  const splashTourSteps = dashSplash;
  // set default language cookie
  useEffect(()=>{
    if(cookies.get('lang')){
      setUserLang(cookies.get('lang'))
    } else {
      cookies.set('lang', "mā", { path: '/' });
    }
  },[]);
  
  //set up changing language on site based on user nav menu selection
  const handleChangeLanguage = (lang) =>{
    console.log("changed");
    setUserLang(lang);
    console.log('langa', lang);
  };

  const { discussions, publicDiscussions } = useTracker(() => {
    Meteor.subscribe("allDiscussions");

    return {
      user: Meteor.userId(),
      discussions: Discussions.find(
        { status: { $ne: "active" } },
        { sort: { createdAt: -1 } }
      ).fetch(),
      publicDiscussions: Discussions.find(
          { $and: [{status: "active"}, {isPublic: {$eq:true}}] },
          { sort: { createdAt: -1 } }
      ).fetch(),
    };
  });

  // noinspection JSNonASCIINames
  return (
    <div>
      <Tour TOUR_STEPS={splashTourSteps}/>
      <NavBar handleChangeLanguage={handleChangeLanguage}/>
      {/*<span style={{height:"20em"}} />*/}
      <Sidebar.Pushable as={Segment} style={{height: 'auto', backgroundColor: 'rgb(25,50,26)'}}>
        <Sidebars />
      <Container inverted={'true'} style={{overflow: "auto", height: "100vh"}}>
        <span style={{height:"30em"}} />
        <Segment attached="top" clearing  inverted style={{border: 'none'}}>
          <Header size="huge">
            <Header.Content as={Container} fluid >

              {siteGlossary.siteWelcome[userLang] + " " + siteGlossary.siteName[userLang]}
            </Header.Content>
          </Header>

        </Segment>

        <Segment attached="bottom" inverted style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
          <Header content={siteGlossary.userDiscourse[userLang]}/>
          <Segment inverted attached="top" style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
            <Header as={'h3'} content={"Public " + siteGlossary.userDiscourse[userLang]} />
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
          <Segment inverted attached="top" style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}>
            <Header as={'h3'} content={"Finished " + siteGlossary.userDiscourse[userLang]} />
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
        </Segment>
      </Container>
      </Sidebar.Pushable>
    </div>
  );
};
