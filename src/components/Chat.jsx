import React from "react";
// import './Chat.css;'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

export default function Chat({room, setChatHistoryProp, chat}) {
    const path = "/room/" + chat.id;
    return <Link to={path}>
        <div>Chat name: {chat.name}</div>
    </Link>;
}