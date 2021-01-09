import React, {useEffect} from "react";
import {
    Container, Segment, Header, Icon,
    Image, Tab, Message, Divider,
} from "semantic-ui-react";
import {Random} from "meteor/random";
import {siteGlossary} from "../../api/glossary";
import {Layout} from "./Layout";

export const Page404 = () => {
    useEffect(() => {
        document.title = "404 Error"
    }, [])

    const fourOhFourPageContent = () => {
        return(
        <Container inverted={'true'} textAlign='left'>
            <Segment attached="bottom" inverted style={{border: 'none', backgroundColor: 'transparent'}}>
                <Header as={'h1'} content={"Ooops, page not found or we haven't built this yet sorry."}/>
            </Segment>
        </Container>
        );
    }

    return (
        <Layout page={fourOhFourPageContent}/>
    );
}
