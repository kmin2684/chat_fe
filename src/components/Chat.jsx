import React from "react";
// import './Chat.css;'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

export default function Chat({room, LoadChat}) {
    const path = "/room/" + room.id;
    return <Link to={path}>
        <div onClick = {() => LoadChat(room.id)}>Chat name: {room.id}</div>
    </Link>;
}