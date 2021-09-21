import React, { useState, useEffect, Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import ChatWindow from "./ChatWindow";
import { MobileViewSide } from "../App";

export default function AddFriend ({chatHistory, myID, width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, setCurrentChatProp}) {
    function onSubmit (e) {
        e.preventDefault();
    }

    const searchResult = <div className="right-row2>">
        username
        <button>Add</button>
    </div>;

    return <>
    <div className="right">
        <form className="right-row1" onSubmit={e => onSubmit(e)}>
            <input type="text" placeholder="search by username" />
        </form>
        {searchResult}
    </div>
    </>;

}