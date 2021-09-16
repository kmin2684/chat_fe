import ChatPeopleList from "./ChatPeopleList";
import ChatPeopleToggle from "./ChatPeopleToggle";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { MobileViewSide } from "../App";

export default function Main ({width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, mobileViewSide, chats}) {

  useEffect(() => {
    if (mobileViewSide) MobileViewSide(mobileViewSide);}
    ,[mobileViewSide]
    );  

  return (
    <div className = 'left'>
      <div className='left-row1'>
        <div className = "Header">
          Header, width={width}
          <button>
            <Link to='/newchat'>
            new chat
            </Link>
          </button>
        </div>
      </div>
        <div className='left-row2'>
          <ChatPeopleList showChat={showChat} setChatHistoryProp={setChatHistoryProp} rooms={rooms} friends={friends} chats={chats}/> 
        </div>
        <div className='left-row3'>
          <ChatPeopleToggle ChatPeopleSwitch={ChatPeopleSwitch}/>
        </div>
    </div>
  );
}