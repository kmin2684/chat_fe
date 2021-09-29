import ChatPeopleList from "./ChatPeopleList";
import ChatPeopleToggle from "./ChatPeopleToggle";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  userHistory,
  useHistory,
} from "react-router-dom";
import { MobileViewSide, SaveUserInfo } from "../App";
import { userInfo2 } from "../test_vars";

export default function Main ({width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, mobileViewSide, chats, userInfo, setUserInfoProp, onClickFriend}) {
  const history = useHistory();
  useEffect(() => {
    if (mobileViewSide) MobileViewSide(mobileViewSide);}
    ,[mobileViewSide]
    );  

  function logout(){
    SaveUserInfo();
    fetch('http://127.0.0.1:8000/chat_app/logout', 
    {
      headers: {
        'authorization': "token " + userInfo.token,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('logged out');
      console.log(data);
      setUserInfoProp(undefined);
    }).catch(error => console.error(error));
  }
  // async function logout(){
  //   let response = await fetch('http://127.0.0.1:8000/chat_app/logout', 
  //   {
  //     headers: {
  //       'authorization': "token " + userInfo.token,
  //       'Content-Type': 'application/json',
  //     },
  //   }); 
  //   let response_json = await response.json();
  //   console.log(response_json);
  // }

  return (
    <div className = 'left'>
      <div className='left-row1'>
        <div className = "Header">
          {/* width={width} */}
          <div>Signed in as: {userInfo.username}</div>
          <button onClick={async () => await logout()}> logout </button>
          <button onClick={()=>history.push('/newchat')}>
            new chat
          </button>
          <button onClick={()=>history.push('/addfriend')}>add a new friend</button>
        </div>
      </div>
        <div className='left-row2'>
          <ChatPeopleList userInfo = {userInfo} onClickFriend={onClickFriend} showChat={showChat} setChatHistoryProp={setChatHistoryProp} rooms={rooms} friends={friends} chats={chats}/> 
        </div>
        <div className='left-row3'>
          <ChatPeopleToggle ChatPeopleSwitch={ChatPeopleSwitch}/>
        </div>
    </div>
  );
}

