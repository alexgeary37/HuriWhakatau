import {Button, Divider, Grid, Header, Icon, Input, List, Menu, Rating, Segment, Sidebar} from "semantic-ui-react";
import React, {useEffect, useState} from "react";
import NotificationBadge from "react-notification-badge";
import {useTracker} from "meteor/react-meteor-data";
import {Groups} from "../../api/groups";
import {NavBar} from "./NavBar";
import Cookies from "universal-cookie/lib";
import {Link} from "react-router-dom";

export const Layout = ({page, isDiscussion}) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [foundFriendsList, setFoundFriendsList] = useState([]);
    const [haveFoundFriends, setHaveFoundFriends] = useState(true);
    const [friendEmail, setFriendEmail] = useState("");
    const [friendInviteError, setFriendInviteError] = useState("");
    const [userLang, setUserLang] = useState("mā");
    //set up changing language on site based on user nav menu selection
    const handleChangeLanguage = (lang) => {
        setUserLang(lang);
    };
    const cookies = new Cookies();

    // set default language cookie
    useEffect(() => {
        if (cookies.get('lang')) {
            setUserLang(cookies.get('lang'))
        } else {
            cookies.set('lang', "mā", {path: '/'});
        }
    }, []);

    const {
        friends,
        pendingFriends,
        groupMembers,
        anyFriendOnline,
        anyGroupMemberOnline,
    } = useTracker(() => {
        //subscribe to roles for user permissions check, should this be ^^ up there?
        // Meteor.subscribe("roles");
        Meteor.subscribe("groups");
        let friendsOnline;
        let groupMembersOnline;
        let fetchedFriendIds = [];
        let fetchedFriends = [];
        let fetchedPendingFriendIds = [];
        let fetchedPendingFriends = [];
        let fetchedGroupMemberIds = [];
        let fetchedGroupMembers = [];
        let currentUser = Meteor.users.findOne({_id: Meteor.userId()});
        let userId = Meteor.userId();
        let fetchedGroups = Groups.find({members: {$elemMatch: {$eq: userId}}}).fetch(); //,

        // once user collection subscription ready and there is a logged in user, find user
        // and get friends and users that the user is in groups with
        if (currentUser?.profile?.friendList) {
            if (currentUser.profile.friendList) {
                fetchedFriendIds = [...currentUser.profile.friendList];
                fetchedFriendIds.forEach((friendId) => {
                    fetchedFriends.push(Meteor.users.findOne({_id: friendId}, {fields: {username: 1, status: 1}}));
                })
            }

            if (fetchedFriends[0] !== undefined) {
                friendsOnline = fetchedFriends.some(friend => friend.status.online === true)
            }

            if (currentUser.profile.pendingFriendList) {
                fetchedPendingFriendIds = currentUser.profile.pendingFriendList;
                fetchedPendingFriendIds.forEach((pendingFriendId) => {
                    fetchedPendingFriends.push(Meteor.users.findOne({_id: pendingFriendId}, {fields: {username: 1}}));
                })
            }

            //add all member ids for each group the user is part of to a total, filter out the user themselves
            fetchedGroups.forEach((group) => {
                fetchedGroupMemberIds.push(...group.members.filter(id => id !== userId));
            });

            // remove duplicate values
            fetchedGroupMemberIds = new Set(fetchedGroupMemberIds);

            // find the users and add to array
            fetchedGroupMemberIds.forEach((memberId) => {
                fetchedGroupMembers.push(Meteor.users.findOne({_id: memberId}, {fields: {username: 1, status: 1}}));
            });

            if (fetchedGroupMembers[0] !== undefined) {
                groupMembersOnline = fetchedGroupMembers.some(member => member.status.online === true);
            }
        }
        return {
            user: Meteor.userId(),
            friends: fetchedFriends,
            pendingFriends: fetchedPendingFriends,
            groupMembers: fetchedGroupMembers,
            anyFriendOnline: friendsOnline,
            anyGroupMemberOnline: groupMembersOnline,
        };
    });

    const handleShowSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    const submitFriendSearch = () => {
        if (searchTerm) {
            setIsSearching(true);
            setHaveFoundFriends(true);
            Meteor.call("users.findFriend", searchTerm, (err, response) => {
                setFoundFriendsList(response);
                setIsSearching(false);
                setSearchTerm("");
                if (response.length === 0) {
                    setHaveFoundFriends(false);
                }
            });
        }
    }

    const addFriend = (friendId) => {
        Meteor.call("users.addPendingFriend", friendId, Meteor.userId(), (_, response) => {
            if (response) {
                let filteredFriendsList = foundFriendsList.filter(function (friend) {
                    return friend._id !== friendId;
                });
                setFoundFriendsList([...filteredFriendsList]);
            }
        });
    }

    const acceptFriend = (friendId) => {
        Meteor.call("users.removePendingFriend", Meteor.userId(), friendId, (_, response) => {
            if (response) {
                Meteor.call("users.addFriend", Meteor.userId(), friendId)
                Meteor.call("users.addFriend", friendId, Meteor.userId())
            }
        });
    }

    const declineFriend = (friendId) => {
        Meteor.call("users.removePendingFriend", Meteor.userId(), friendId);
    }

    const inviteFriend = () => {
        if (friendEmail) {
            setFriendInviteError("")
            Meteor.call("users.inviteFriend", friendEmail, (err, _) => {
                if (err) {
                    setFriendInviteError(err.reason);
                }
            });
            setFriendEmail("");
        } else {
            setFriendInviteError("Must be a valid email address")
        }
    }

    const searchFriendsComponent = () => {
        return (
            <div style={{marginLeft: "10px", width: "40vh"}} onClick={(e) => e.stopPropagation()}>
                <Input
                    style={{marginTop: '10px', width: 240}}
                    type="text"
                    placeholder="Username or email"
                    name="searchFriends"
                    fluid
                    focus
                    value={searchTerm}
                    /*onChange={(e) => setSearchTerm(e.currentTarget.value)}*/
                    onChange={(e) => {
                        e.currentTarget.value.indexOf("@") > 0
                            ? setFriendEmail(e.currentTarget.value) : null;
                        setSearchTerm(e.currentTarget.value);
                    }}
                />
                <Button onClick={submitFriendSearch} icon labelPosition='right'>
                    Search
                    <Icon loading={isSearching} name={!isSearching ? 'right arrow' : 'circle notch'}/>
                </Button>
                <Button onClick={inviteFriend} icon labelPosition='right'>
                    Invite
                    <Icon name={'envelope'}/>
                </Button>
            </div>
        );
    }

    const inviteFriendsComponent = () => {
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <h3>Sorry No friends found, invite one!</h3>
            </div>
        );
    }
    return (
        <Segment inverted
                 textAlign='center'
                 style={{minHeight: 800, padding: '1em 0em'}}
                 vertical>
            <NavBar handleChangeLanguage={handleChangeLanguage}/>
            <Sidebar.Pushable as={Segment} style={{height: '90vh', backgroundColor: 'rgb(30,30,30)'}}>
                <div>
                    <Sidebar
                        as={Segment}
                        textAlign='left'
                        animation='overlay'
                        className={(showSidebar ? "custom wide" : "very thin") + ' friends'}
                        icon='labeled'
                        vertical
                        visible
                        onMouseOver={!showSidebar ? handleShowSidebar : null}
                        onClick={handleShowSidebar}
                        style={{
                            backgroundColor: "#f4f3f5"
                        }}
                    >
                        <Icon size={'big'} name={(showSidebar ? 'left' : 'right') + ' arrow alternate circle'}
                              style={{marginTop: "-10px", marginLeft: (showSidebar ? "220px" : "35px")}}/>
                        {/*my friends*/}
                        <Menu.Item style={{marginTop: "20px", marginLeft: "10px", fontWeight: "bold"}}
                                   title={anyFriendOnline ? 'There are friends online' : 'No friends online'}>
                            <Icon size={'large'} name='users'/>
                            {anyFriendOnline && !showSidebar &&
                            <Rating icon='star' defaultRating={1} maxRating={1} disabled/>
                            }
                            <br/>
                            Friends
                        </Menu.Item>
                        <Divider/>
                        <List>
                            {showSidebar && friends && friends.map((friend) => (
                                <Menu.Item style={{marginLeft: "20px"}} key={friend._id}
                                           title={friend.status.online ?
                                               friend.status.idle ? 'idle' : 'online' : 'offline'}>
                                    <div style={{
                                        display: 'inline-block',
                                        fontSize: "13pt"
                                    }}>{friend.username}<NotificationBadge
                                        key={friend._id}
                                        count={1}
                                        effect={[null, null, null, null]}
                                        style={{
                                            color: friend.status.online ? friend.status.idle ? "yellow" : "green" : "red",
                                            backgroundColor: friend.status.online ? friend.status.idle ? "yellow" : "green" : "red",
                                            top: "-15px",
                                            left: "",
                                            bottom: "",
                                            right: "-20px",
                                            fontSize: "7px",
                                            padding: "3px 5px",
                                        }}
                                    /></div>
                                </Menu.Item>
                            ))}
                        </List>
                        <List>
                            {showSidebar && pendingFriends && pendingFriends.map((pendingFriend) => (
                                <Menu.Item
                                    key={pendingFriend._id} /*title={pendingFriend.online ? 'online' : 'offline'}*/>
                                    {pendingFriend.username}
                                    <Button negative size={'mini'} compact={true}
                                            onClick={() => acceptFriend(pendingFriend._id)}>
                                        ACCEPT
                                    </Button>
                                    <Button negative size={'mini'} compact={true}
                                            onClick={() => declineFriend(pendingFriend._id)}>
                                        DECLINE
                                    </Button>
                                </Menu.Item>
                            ))}
                        </List>
                        {showSidebar && foundFriendsList && <div onClick={(e) => e.stopPropagation()}>
                            {foundFriendsList.map((potentialFriend) => (
                                <Menu.Item key={potentialFriend._id}>
                                <span style={{
                                    paddingLeft: '15px',
                                    paddingRight: '20px'
                                }}>{potentialFriend.username}</span>
                                    <Button negative size={'mini'} compact={true} attached={'right'}
                                            onClick={() => addFriend(potentialFriend._id)}>
                                        Request Friend
                                    </Button>
                                </Menu.Item>
                            ))}</div>}
                        {showSidebar && !haveFoundFriends && inviteFriendsComponent()}
                        {showSidebar && searchFriendsComponent()}
                        {showSidebar && friendInviteError && <div style={{color: 'red', fontWeight: 'bold'}}>
                            &nbsp;&nbsp;&nbsp;{friendInviteError}</div>}
                        {/*my group members, update to have a group member specific user set*/}
                        <Menu.Item style={{marginLeft: "10px", fontWeight: "bold"}} title={anyGroupMemberOnline ?
                            'There are members online' : 'No members online'}>
                            <Icon size={'large'} name='users'/>
                            {anyGroupMemberOnline && !showSidebar &&
                            <Rating icon='star' defaultRating={1} maxRating={1} disabled/>
                            }
                            <br/>
                            Group Members
                        </Menu.Item>
                        <Divider/>
                        <List>
                            {showSidebar && groupMembers && groupMembers.map((groupMember) => (
                                <Menu.Item style={{marginLeft: "20px"}} key={groupMember._id}
                                           title={groupMember.status.online ?
                                               groupMember.status.idle ? 'idle' : 'online' : 'offline'}>
                                    <div style={{
                                        display: 'inline-block',
                                        fontSize: "13pt"
                                    }}>{groupMember.username}<NotificationBadge
                                        key={groupMember._id}
                                        count={1}
                                        effect={[null, null, null, null]}
                                        style={{
                                            color: groupMember.status.online ? groupMember.status.idle ? "yellow" : "green" : "red",
                                            backgroundColor: groupMember.status.online ? groupMember.status.idle ? "yellow" : "green" : "red",
                                            top: "-15px",
                                            left: "",
                                            bottom: "",
                                            right: "-20px",
                                            fontSize: "7px",
                                            padding: "3px 5px",
                                        }}
                                    /></div>
                                </Menu.Item>
                            ))}
                        </List>
                    </Sidebar>
                    <Sidebar
                        as={Segment}
                        animation='push'
                        icon='labeled'
                        aria-label="sidebar image right"
                        inverted
                        vertical
                        direction={'right'}
                        visible
                        width={"very thin"}
                        style={{
                            backgroundColor: 'rgb(30, 30, 30)',
                            backgroundImage: `url(${"/HuriWhakatauIconHalfOpenInvertedVertical.png"})`,
                            backgroundSize: '60px',
                            backgroundRepeat: 'repeat-y'
                        }}
                    />
                    <Sidebar.Pusher style={{backgroundColor: 'rgb(10, 10, 10)', overflow: "auto", height: "90vh"}}
                                    dimmed={showSidebar}
                                    onClick={showSidebar ? handleShowSidebar : null}>
                        {page(userLang)}
                        <Divider/>
                        {!isDiscussion &&
                        <Segment inverted style={{
                            backgroundColor: 'rgb(10, 10, 0)'
                        }}>
                            <Grid stackable>
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Header inverted><u>Site links</u></Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={5} textAlign={'left'}>
                                    <Grid.Column>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <List>
                                            <List.Item as={Link} to={'/'}>Home</List.Item>
                                            <List.Item as={Link} to={'/contact-us'}>Contact Us</List.Item>
                                            <List.Item as={Link} to={'/about'}>About Us</List.Item>
                                            <List.Item as={Link} to={'/FAQ'}>FAQ</List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <List>
                                            <List.Item>Research</List.Item>
                                            <List.Item>Careers</List.Item>
                                            <List.Item>University Links</List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <List>
                                            <List.Item></List.Item>
                                            <List.Item></List.Item>
                                            <List.Item></List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>}
                    </Sidebar.Pusher>
                </div>
            </Sidebar.Pushable>

        </Segment>
    );
}
