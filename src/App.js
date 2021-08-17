import "./App.css";
import ChatPeopleList from "./components/ChatPeopleList.jsx";
import ChatPeopleToggle from "./components/ChatPeopleToggle.jsx";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
// import LeftWindow from "./components/LeftWindow";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const room1 = {
  id: '1',
  members_id: ['1', '2'],
  messages: [
    {content:'message1', sender:'stranger', time:'1min ago'},
    {content:'message2', sender:'me', time:'now'},
  ],
};

const room2 = {
  id: '2',
  members_id: ['1', '3'],
  messages: [
    {content:'message3', sender:'stranger', time:'3min ago'},
    {content:'message4', sender:'me', time:'1min ago'},
  ],
};

const friend_list = [
  {id: '2', username: 'user2'},
  {id: '3', username: 'user3'},
  {id: '4', username: 'user4'},
];

const room_list = [
  {
    id: '1', 
    users_id: ['1', '2'], 
    last_message: {
      content:'message2', 
      sender:'me', 
      time:'now'
    }
  },
  {
    id: '2', 
    users_id: ['1', '3'], 
    last_message: {
      content:'message3', 
      sender:'joe', 
      time:'1min'
    }
  },
];



export default function App() {
  // let { room_id } = useParams();


  // monitoring viewport width
  const [windowDimensions, setWindowDimensions] = useState({width: null});
  const {width} = windowDimensions; 

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []
  );

  // switching between chat and people list
  const [showChat, setShowChat] = useState(true);
  function ChatPeopleSwitch(state) {
    state? setShowChat(true) : setShowChat(false);
  }

  // displaying chat history
  const [chatHistory, setChatHistory] = useState(null);
  function LoadChat(chat) { 
    console.log('load '+chat);
    let current = [room1, room2].find(room => room.id === chat);
    console.log('current is');
    console.log('current');
    setChatHistory(current);
    console.log(chatHistory);
  }


  return (
    <div className = 'App'> 
      <Router>
        <Switch> 
          <Route exact path="/">
            <LeftWindow 
            width = {width} 
            showChat = {showChat} 
            LoadChat = {LoadChat} 
            ChatPeopleSwitch = {ChatPeopleSwitch}
            rooms = {room_list}
            friends = {friend_list}
            />
            <RightWindow chatHistory = {chatHistory} LoadChat={LoadChat}/>
          </Route>
          <Route path="/room/:room_id">
            <LeftWindow 
            width = {width} 
            showChat = {showChat} 
            LoadChat = {LoadChat} 
            ChatPeopleSwitch = {ChatPeopleSwitch}
            rooms = {room_list}
            friends = {friend_list}
            />
            <RightWindow chatHistory = {chatHistory} LoadChat={LoadChat}/>
          </Route>
        </Switch> 
      </Router>
    </div>
  );
}

function LeftWindow ({width, showChat, LoadChat, ChatPeopleSwitch, rooms, friends}) {
  return (
    <>
      <div className='left row1'>
        <div className = "Header">
          Header, width={width}
        </div>
      </div>
        <div className='left row2'>
          <ChatPeopleList showChat={showChat} LoadChat={LoadChat} rooms={rooms} friends={friends}/> 
        </div>
        <div className='left row3'>
          <ChatPeopleToggle ChatPeopleSwitch={ChatPeopleSwitch}/>
        </div>
    </>
  );
}

function RightWindow ({chatHistory, LoadChat}) {
  let { room_id } = useParams();
  room_id? LoadChat(room_id) : LoadChat(null);
  return (
    <>
      <div className='right'>
        {room_id}
        <ChatWindow chatHistory={chatHistory}/>
      </div>
    </>
  );
}