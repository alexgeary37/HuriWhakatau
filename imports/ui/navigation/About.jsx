import React, {useEffect, useState} from "react";
import {
    Container, Segment, Header, Icon,
    Image, Sidebar, Tab, Message, Divider,
} from "semantic-ui-react";
import {Random} from "meteor/random";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {Sidebars} from "/imports/ui/navigation/Sidebars";
import {siteGlossary} from "../../api/glossary";
import Cookies from "universal-cookie/lib";
import {Layout} from "./Layout";

export const About = () => {
    // const cookies = new Cookies();
    // const [userLang, setUserLang] = useState("mā");
    // useEffect(() => {
    //     if (cookies.get('lang')) {
    //         setUserLang(cookies.get('lang'))
    //     } else {
    //         cookies.set('lang', "mā", {path: '/'});
    //     }
    //     document.title = "About Page";
    // }, []);
    //
    // //set up changing language on site based on user nav menu selection
    // const handleChangeLanguage = (lang) => {
    //     setUserLang(lang);
    // };
    useEffect(()=>{document.title = "About Page"},[])


    const panes = [
        {
            menuItem: 'Huri Whakatau', render: () =>
                <Tab.Pane inverted style={{border: 'none'}}>
                    <p>
                        Huri Whakatau is an online discussion platform we have been developing over the last two years
                        in collaboration with Māori and Iñupiat researchers, engineers and participants. Our platform
                        will
                        provide a cloud solution to organizations, communities and researchers for assisting small
                        groups of people to effectively reach consensus on ‘hot’ topics. Crucially, Huri Whakatau acts
                        as our
                        case study to discover how software should be engineered for (and by) Māori and Indigenous
                        Peoples.
                    </p>
                    <Message.Content>
                        Huri Whakatau is a digital environment designed to host discussions
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

                    <Header>Indigenous Content</Header>
                    <p>
                        The <a
                        href={"https://maoridictionary.co.nz/search?idiom=&phrase=&proverb=&loan=&keywords=kowhaiwhai&search="}
                        target={"_blank"}>kowhaiwhai</a> used on this site is an original design created for
                        Huri Whakatau. The symbolism is intended to be a fusion of traditional Maori koru patterns and
                        circuit board architecture. The intention is to convey that this is a digital space that is
                        friendly to traditional culture.
                    </p>
                </Tab.Pane>
        },
        {
            menuItem: 'Our People', render: () =>
                <Tab.Pane inverted style={{border: 'none'}}>
                    <Image src='/PanosProfilePhoto3.jpg' size='tiny' alt={'Panos Patros Bio Picture'}/>
                    <Header content={'Panos Patros: PI. The cool kind: Principal Investigator'}/>
                    Panos is a Member of Engineering New Zealand and is interested in various aspects of Software
                    Engineering.
                    He joined the Department of Computer Science of the University of Waikato in July 2018 as a
                    Lecturer; soon after, he started the Oceania Researchers in Cloud and Adaptive-systems (ORCA) lab.
                    He also cuts quite the striking figure in a suit doesn't he?
                    {/*<Button type="button" icon /!*style = {{marginLeft: "20px"}}*!/>*/}
                    {/*</Button>*/}
                    <br/>
                    <a href={"https://twitter.com/PanosPatros"} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: panos.patros@waikato.ac.nz"} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={"https://www.cms.waikato.ac.nz/people/ppatros/"} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/panos-patros/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <Divider/>
                    <Image src='/TeTaka.jpg' size='tiny' alt={'Te Taka Bio Picture'}/>
                    <Header content={'Te Taka Keegan: Associate Investigator'}/>
                    Te Taka completed a PhD in 2007, titled Indigenous Language Usage in a Digital Library: He
                    Hautoa Kia Ora Tonu Ai. He has worked on a number of projects involving the Māori language and
                    technology.
                    These include the Māori Niupepa Collection, Te Kete Ipurangi, the Microsoft keyboard, Microsoft
                    Windows and Microsoft Office in Māori, Moodle in Māori, Google Web Search in Māori, and the Māori
                    macroniser. In 2013 Te Taka was awarded the University of Waikato's Māori/Indigenous Excellence
                    Award for
                    Research. In 2017 Te Taka was awarded the Prime Minister’s Supreme Award for Tertiary Teaching
                    Excellence.
                    <br/>
                    <a href={""} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: tetaka@waikato.ac.nz"} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={"https://www.cms.waikato.ac.nz/people/tetaka"} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/te-taka-keegan-505149b/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <Divider/>
                    <Image src={Random.choice(['/EarlyPeterCapaldi.jpg', '/Tony_Smith.jpg'])} size='tiny'
                           alt={'Tony Smith Bio Picture'}/>
                    <Header content={'Tony Smith: Associate Investigator'}/>
                    Tony received his undergraduate and graduate degrees in Computer Science from the University of
                    Calgary, and earned his PhD at the University of Waikato. A general theme of his research is
                    adaptive systems. His background is in artificial intelligence and
                    machine learning and recently he has been working on bioinformatics projects, and on
                    applications of reinforcement learning within autonomous agents.
                    And he didn't fail me in Bioinformatics last year even though he easily could have. And his
                    pictures look like the start and end of Peter Capaldi's reign on Doctor Who.
                    <br/>
                    <a href={""} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: tcs@waikato.ac.nz"} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={"http://www.cs.waikato.ac.nz/~tcs/"} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/tony-smith-84348a45/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <Divider/>
                    <Image src={Random.choice(['/aarondant_real.jpg', '/aarondant.jpg'])} size='tiny'
                           alt={'Aaron Dant Bio Picture'}/>
                    <Header content={'Aaron Dant: Key Researcher'}/>
                    Aaron is Chief Data Scientist at ASRC Federal (yes all those capitals) and is responsible for
                    research and development using a variety of techniques including natural language processing,
                    supervised
                    and unsupervised learning. Aaron has over 20 years of experience building enterprise scale
                    applications, including 10+ years developing cloud scale analytic systems for federal customers.
                    In 2018 Aaron was one of <a
                    href={"https://washingtonexec.com/2018/11/top-ai-execs-to-watch-aaron-dant-asrc-federal/#.X4PzAGj7Ryw"}
                    target={"_blank"}> Washington Exec's Top AI Execs to watch</a>.
                    (I for one am glad he ditched that wig).
                    <br/>
                    <a href={""} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: aaron.dant@asrcfederal.com"} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={"https://webcache.googleusercontent.com/search?q=cache:ujXBStxJACYJ:https://www.asrcfederal.com/ai-machine-learning/aaron-dant+&cd=1&hl=en&ct=clnk&gl=nz"}
                       target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/aaron-dant-32365a160/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <Divider/>
                    <Image src='/PhilFeldman.jpg' size='tiny' alt={'Phil Feldman Bio Picture'}/>
                    <Header content={'Phil Feldman: Key Researcher'}/>
                    Phil is Research Scientist at ASRC Federal and completing his Phd and is also leading the
                    development of Supervised Machine Learning, AI and Network Analytics for ASRC Federal.
                    An accomplished polymath Phil has experience in a variety of programming languages and
                    disciplines (even ones no one cares about anymore like Pascal and R). From robotics to art, ecology,
                    web
                    development and management, is there nothing this man can't do?
                    Yes, it's knowing that you shouldn't put your entire experience and history into a tiny menu box
                    that you have to constantly click a button to scroll through with any reliability.
                    <br/>
                    <a href={"https://twitter.com/philfeld"} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: "} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={"http://philfeldman.com/"} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/phil-feldman-phd-0584965/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <a href={"phifel.wordpress.com/"} target={"_blank"}>
                        <Icon className={"wordpress"}/>
                    </a>
                    <Divider/>
                    <Image src='/Alex-Geary.jpg' size='tiny' alt={'Alex Geary Bio Picture'}/>
                    <Header content={'Alex Geary: Research Assistant and Software Engineer'}/>
                    Alex is currently completing his Bachelor of Computer Science with Honours at the University of
                    Waikato. His focus is on something. Not really sure. He also completed his Bachelor of Music with
                    Honours
                    in 2016.
                    At some point you have to leave university dude.
                    <br/>
                    <a href={""} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: "} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={""} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://linkedin.com/in/alex-geary-b75438144/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <Divider/>
                    <Image src='/tamahaubrown.jpg' size='tiny' alt={'Tamahau Brown Bio Picture'}/>
                    <Header content={'Tamahau Brown: Research Assistant and Software Engineer'}/>
                    Tamahau is currently completing his Bachelor of Computer Science with Honours at the University
                    of Waikato. His focus is on Maori and indigenous representation and advancement in digital
                    environments. Tamahau is a keen gamer and will heal your tank when he's in trouble. And stuff.
                    <br/>
                    <a href={""} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: "} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={""} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/tamahau-brown-9287b7139/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <Divider/>
                    <Image src='/PriyankVyas.jfif' size='tiny' alt={'Priyank Vyas Bio Picture'}/>
                    <Header content={'Priyank Vyas: Research Assistant and Software Engineer'}/>
                    Priyank has a Bachelor of Computing and Mathematical Sciences focused in Computer Science from
                    The University of Waikato. His focus currently is natural language processing which he is
                    employing to analyse the data generated by Huri Whakatau.
                    <br/>
                    <a href={""} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: "} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={""} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/priyank-vyas-644501110/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <Divider/>
                    <Image src='/user-icon_291700.jpg' size='tiny' alt={'Generic Bio Picture'}/>
                    <Header content={'Chris Symon: Software Engineer'}/>
                    Chris built the the initial version of Huri Whakatau (or Jury Room) and while no longer with
                    us deserves to be remembered here (no, he's not dead. Just dead to me, return your emails man!).
                    <br/>
                    <a href={""} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: "} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={""} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={""} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    {/* here be dragons, I mean stuff we can't show yet*/}
                    {/*<Divider/>*/}
                    {/*<Image src='/tangiora-maney.jpg' size='tiny' />*/}
                    {/*<Header content={'Tangiora Maney: Design Consultant'}/>*/}
                    {/*Tangiora is currently completing her Bachelor of Design, Communication Design at the University of Waikato.*/}
                    {/*She has provided valuable input on the design of Huri Whakatau.*/}
                    {/*https://www.linkedin.com/in/tangiora-maney-a18188199/*/}
                    <Divider/>
                    <br/>
                    <Image src='/darcycowan.jpg' size='tiny' alt={'Darcy Cowan Bio Picture'}/>
                    <Header content={'Darcy Cowan: Principle Software Engineer'}/>
                    Darcy obtained a Bachelor of Science in 2001. After spending 20 years in industry he joined the
                    dark side (because they have cookies) and is now completing a Master of Computer Science at the
                    University
                    of Waikato.
                    Darcy has built the majority of the current version of Huri Whakatau and never lets the rest of
                    the team forget it.
                    He also wrote this About page, any errors, omissions, spelling mistakes or snarky comments are
                    his alone.
                    <br/>
                    <a href={"https://twitter.com/Fineterribly"} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    <a href={"mailto: darcywcowan@gmail.com"} target={"_blank"}>
                        <Icon className={"envelope"}/>
                    </a>
                    <a href={""} target={"_blank"}>
                        <Icon className={"world"}/>
                    </a>
                    <a href={"https://www.linkedin.com/in/darcycowan/"} target={"_blank"}>
                        <Icon className={"linkedin"}/>
                    </a>
                    <a href={"https://scepticon.wordpress.com/"} target={"_blank"}>
                        <Icon className={"wordpress"}/>
                    </a>
                    <br/>
                    {/**/}
                    <Header content={'Acknowledgements'}/>
                    Thank you to the Faculty of Māori & Indigenous Studies at University of Waikato for input and
                    mentorship.
                    <br/>
                    <a href={"https://twitter.com/FMIS_Waikato"} target={"_blank"}>
                        <Icon className={"twitter"}/>
                    </a>
                    {/* links for ASRC Federal - On behalf of ASRC Federal Aaron Dant & Phil Feldman have been mentors,
                     colleagues and friends to the students working on this project.
                     Thank you for your knowledge, time, insight and compassion. */}
                    {/*https://twitter.com/asrc*/}
                    {/*https://www.asrcfederal.com/*/}
                </Tab.Pane>
        },
    ];

    const aboutPageContent = (userLang) => {
        return(
            <Container inverted={'true'} textAlign='left'>
                <Segment attached="bottom" inverted style={{border: 'none', backgroundColor: 'transparent'}}>
                    <span style={{height: "32em"}}/>
                    <Header as={'h1'} content={siteGlossary.siteBio[userLang]}/>
                    <Tab menu={{inverted: true}} panes={panes}/>
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
        //     <Sidebar.Pushable as={Segment} style={{height: '90vh', backgroundColor: 'rgb(30, 30, 30)'}}>
                <Layout page={aboutPageContent}/>
                // {/*<Sidebars/>*/}
                // {/*<Sidebar.Pusher style={{backgroundColor: 'rgb(10, 10, 10)', overflow: "auto", height: "80vh",}}>*/}
                // {/*    <Container inverted={'true'}>*/}
                // {/*        <Segment attached="bottom" inverted style={{border: 'none', backgroundColor: 'transparent'}}>*/}
                // {/*            <span style={{height: "32em"}}/>*/}
                // {/*            <Header as={'h1'} content={siteGlossary.siteBio[userLang]}/>*/}
                // {/*            <Tab menu={{inverted: true}} panes={panes}/>*/}
                // {/*        </Segment>*/}
                // {/*    </Container>*/}
                // {/*</Sidebar.Pusher>*/}
        //     </Sidebar.Pushable>
        // </Segment>
    );
};
