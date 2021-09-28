import React from "react";
// import './Chat.css;'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory,
  } from "react-router-dom";

export default function Chat({room, setChatHistoryProp, chat, userInfo}) {
    let history = useHistory();
    const path = "/room/" + chat.id;
    const chatName = chat.name? chat.name 
    : chat.members.length === 2 ? chat.members.find(member => member !== userInfo.username)
    : undefined


    return <div onClick={()=>history.push(path)}>{chatName}</div>
    // return <Link to={path}>
    //     <div>Chat name: {chat.name}</div>
    // </Link>;
}