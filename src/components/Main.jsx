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
import {StringToColor} from '../App'
import { userInfo2 } from "../test_vars";
import logoutIcon from "../icons/log-out.svg";
import pencilIcon from "../icons/pencil-fill.svg";
import personPlusIcon from "../icons/person-plus-fill.svg";
import xIcon from "../icons/x-lg.svg";

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

  const profilePage = 
    <div className = 'profile-page'>
      <div className = 'profile-header'>
        <div className = 'profile-header-left'>
          <div className='iconContainer'>
            <img src={xIcon} className='icon' onClick={()=>ProfileOn(false)}/>
          </div>
          <div>
            Me
          </div>
        </div>
        <div className='iconContainer'>
          <img src={logoutIcon} className='icon' onClick={async () => await logout()}/>
        </div>
      </div>
      <div className='userIcon large'>
        {userInfo.username[0]}
      </div>
      <div className = 'profile-username'>
        {userInfo.username}
      </div>

    </ div>;
  
  function ProfileOn(state) {
    let profile = document.querySelector('.profile-page');
    if (state) profile.style.display = 'block';
    else profile.style.display = 'none';
  }

  return (
    <div className = 'left'>
      {profilePage}
      <div className='left-row1'>
        <div className = "Header">
          {/* width={width} */}
          <div className = 'Header-left'>
            <div className='userIcon' style={{backgroundColor: StringToColor(userInfo.username)}} onClick={()=>ProfileOn(true)}>
                {userInfo.username[0]}
            </div>
            {showChat? 'Chats' : 'People'}
            {/* <div className='ask'>
              ask
            </div> */}
          </div>

          <div className='buttons'>
            
            {/* <button onClick={()=>history.push('/addfriend')}>add a new friend</button>
            <button onClick={()=>history.push('/newchat')}>
              new chat
            </button> */}
            <div className='iconContainer'>
              <img src={personPlusIcon} className='icon' onClick={()=>history.push('/addfriend')}/>
            </div>
            <div className='iconContainer'>
              <img src={pencilIcon} className='icon' onClick={()=>history.push('/newchat')}/>
            </div>
          </div>
        </div>
        <div>
          Signed in as: {userInfo.username}
          {/* <button onClick={async () => await logout()}> logout </button> */}
          <div className='iconContainer'>
            <img src={logoutIcon} className='icon' onClick={async () => await logout()}/>
          </div>
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

