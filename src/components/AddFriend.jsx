import React, { useState, useEffect, Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory
} from "react-router-dom";
import ChatWindow from "./ChatWindow";
import { MobileViewSide } from "../App";

export default function AddFriend ({chatHistory, myID, width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, setCurrentChatProp}) {
    const history = useHistory();
    function onSubmit (e) {
        e.preventDefault();
    }

    const searchResult = <div className="right-row2>">
        username
        <button>Add</button>
    </div>;

    return <>
    <div className="right">
        <div className="right-row1">
            <div><button onClick={() => history.push('/')}>Home</button></div>
            <form onSubmit={e => onSubmit(e)}>
                <input type="text" placeholder="search by username" />
            </form>
        </div>
        {searchResult}
    </div>
    </>;

}