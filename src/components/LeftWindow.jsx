import ChatPeopleList from "./ChatPeopleList.jsx";
import ChatPeopleToggle from "./ChatPeopleToggle.jsx";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import ChatWindow from "./ChatWindow";

export default function LeftWindow ({width, showChat, LoadChat, ChatPeopleSwitch}) {
    return (
      <>
        <div className='left row1'>
          <div className = "Header">
            Header, width={width}
          </div>
        </div>
          <div className='left row2'>
            <ChatPeopleList showChat={showChat} LoadChat={LoadChat}/> 
          </div>
          <div className='left row3'>
            <ChatPeopleToggle ChatPeopleSwitch={(state) => ChatPeopleSwitch(state)}/>
          </div>
      </>
    );
  }