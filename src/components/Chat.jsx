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

export default function Chat({room, setChatHistoryProp, chat}) {
    let history = useHistory();
    const path = "/room/" + chat.id;
    return <div onClick={()=>history.push(path)}>{chat.name}</div>
    // return <Link to={path}>
    //     <div>Chat name: {chat.name}</div>
    // </Link>;
}