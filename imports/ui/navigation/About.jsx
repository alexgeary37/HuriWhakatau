import React, {useState} from "react";
import {
    Button,
    Container,
    Segment,
    Header,
    Message,
    List,
    Icon,
    Divider, Image, Sidebar,
} from "semantic-ui-react";
import { Random } from "meteor/random";
import {NavBar} from "/imports/ui/navigation/NavBar";
import {Link} from "react-router-dom";

export const About = () => {

    return (
        <div /*style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}*/>
            <NavBar/>
            <Sidebar
                as={Segment}
                animation='overlay'
                icon='labeled'
                inverted
                vertical
                visible
                width={"very thin"}
                style={{
                    backgroundColor: 'rgb(0, 0, 0)',
                    backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,
                    backgroundSize: '60px',
                    backgroundRepeat: 'repeat-y'}}
            ></Sidebar>
            <Container inverted={'true'} /*style={{overflow: "auto", height: "90vh", backgroundColor: 'rgb(10, 10, 10)'}}*/>
                <Segment attached="bottom" inverted /*style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}*/>
                    <span style={{height:"32em"}}/>
                    <Header as={'h1'} content="About Huri Whakatau"/>
                    <Segment inverted /*style={{backgroundColor: 'rgb(10, 10, 10)', border: 'none'}}*/>
                        Huri Whakatau is an online discussion platform we have been developing over the last two years
                        in collaboration with Māori and Iñupiat researchers, engineers and participants. Our platform will
                        provide a cloud solution to organizations, communities and researchers for assisting small
                        groups of people to effectively reach consensus on ‘hot’ topics. Crucially, Huri Whakatau acts as our
                        case study to discover how software should be engineered for (and by) Māori and Indigenous
                        Peoples.
                        <br/>
                        <Header as={'h2'} content={'Our Team'}/>
                        <Image src='/PanosProfilePhoto3.jpg' size='tiny' />
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
                        <br/>
                        <br/>
                        <br/>
                        <Image src='/TeTaka.jpg' size='tiny' />
                        <Header content={'Te Taka Keegan: Associate Investigator'}/>
                        Te Taka completed a PhD in 2007, titled Indigenous Language Usage in a Digital Library: He
                        Hautoa Kia Ora Tonu Ai. He has worked on a number of projects involving the Māori language and technology.
                        These include the Māori Niupepa Collection, Te Kete Ipurangi, the Microsoft keyboard, Microsoft
                        Windows and Microsoft Office in Māori, Moodle in Māori, Google Web Search in Māori, and the Māori
                        macroniser. In 2013 Te Taka was awarded the University of Waikato's Māori/Indigenous Excellence Award for
                        Research. In 2017 Te Taka was awarded the Prime Minister’s Supreme Award for Tertiary Teaching Excellence.
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
                        <br/>
                        <br/>
                        <br/>
                        <Image src={Random.choice(['/EarlyPeterCapaldi.jpg', '/Tony_Smith.jpg'])} size='tiny'/>
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
                        <br/>
                        <br/>
                        <br/>
                        <Image src={Random.choice(['/aarondant_real.jpg', '/aarondant.jpg'])} size='tiny' />
                        <Header content={'Aaron Dant: Key Researcher'}/>
                        Aaron is Chief Data Scientist at ASRC Federal (yes all those capitals) and is responsible for
                        research and development using a variety of techniques including natural language processing, supervised
                        and unsupervised learning. Aaron has over 20 years of experience building enterprise scale
                        applications, including 10+ years developing cloud scale analytic systems for federal customers.
                        In 2018 Aaron was one of  <a
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
                        <a href={"https://webcache.googleusercontent.com/search?q=cache:ujXBStxJACYJ:https://www.asrcfederal.com/ai-machine-learning/aaron-dant+&cd=1&hl=en&ct=clnk&gl=nz"} target={"_blank"}>
                            <Icon className={"world"}/>
                        </a>
                        <a href={"https://www.linkedin.com/in/aaron-dant-32365a160/"} target={"_blank"}>
                            <Icon className={"linkedin"}/>
                        </a>
                        <br/>
                        <br/>
                        <br/>
                        <Image src='/PhilFeldman.jpg' size='tiny' />
                        <Header content={'Phil Feldman: Key Researcher'}/>
                        Phil is Research Scientist at ASRC Federal and completing his Phd and is also leading the
                        development of Supervised Machine Learning, AI and Network Analytics for ASRC Federal.
                        An accomplished polymath Phil has experience in a variety of programming languages and
                        disciplines (even ones no one cares about anymore like Pascal and R). From robotics to art, ecology, web
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
                        <br/>
                        <br/>
                        <br/>
                        <Image src='/Alex-Geary.jpg' size='tiny' />
                        <Header content={'Alex Geary: Research Assistant and Software Engineer'}/>
                        Alex is currently completing his Bachelor of Computer Science with Honours at the University of
                        Waikato. His focus is on something. Not really sure. He also completed his Bachelor of Music with Honours
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

                        <br/>
                        <br/>
                        <br/>
                        <Image src='/tamahaubrown.jpg' size='tiny' />
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
                        <br/>
                        <br/>
                        <br/>
                        <Image src='/PriyankVyas.jfif' size='tiny' />
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
                        <br/>
                        <br/>
                        <br/>
                        <Image src='/user-icon_291700.jpg' size='tiny' />
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
                        {/*<br/>*/}
                        {/*<br/>*/}
                        {/*<br/>*/}
                        {/*<Image src='/tangiora-maney.jpg' size='tiny' />*/}
                        {/*<Header content={'Tangiora Maney: Design Consultant'}/>*/}
                        {/*Tangiora is currently completing her Bachelor of Design, Communication Design at the University of Waikato.*/}
                        {/*She has provided valuable input on the design of Huri Whakatau.*/}
                        {/*https://www.linkedin.com/in/tangiora-maney-a18188199/*/}
                        <br/>
                        <br/>
                        <br/>
                        <Image src='/darcycowan.jpg' size='tiny' />
                        <Header content={'Darcy Cowan: Principle Software Engineer'}/>
                        Darcy obtained a Bachelor of Science in 2001. After spending 20 years in industry he joined the
                        dark side (because they have cookies) and is now completing a Master of Computer Science at the University
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
                        {/*https://twitter.com/FMIS_Waikato*/}
                        {/*https://twitter.com/asrc*/}
                        {/*https://www.asrcfederal.com/*/}
                    </Segment>
                </Segment>
            </Container>
            <Sidebar
                as={Segment}
                animation='overlay'
                icon='labeled'
                direction={'right'}
                inverted
                vertical
                visible
                width={"very thin"}
                style={{
                    backgroundColor: 'rgb(0, 0, 0)',
                    backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,
                    backgroundSize: '60px',
                    backgroundRepeat: 'repeat-y'}}
            ></Sidebar>
        </div>
    );
};
