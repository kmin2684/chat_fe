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

export default function Main ({width, showChat, LoadChat, ChatPeopleSwitch, rooms, friends}) {
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
            <ChatPeopleList showChat={showChat} LoadChat={LoadChat} rooms={rooms} friends={friends}/> 
          </div>
          <div className='left-row3'>
            <ChatPeopleToggle ChatPeopleSwitch={ChatPeopleSwitch}/>
          </div>
      </div>
    );
  }