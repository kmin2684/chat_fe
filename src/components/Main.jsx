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
import { MobileViewSide, SaveUserInfo, StringToColor } from "../others/shared_functions";
// import { userInfo2 } from "../test_vars";
import logoutIcon from "../icons/log-out.svg";
import pencilIcon from "../icons/pencil-fill.svg";
import personPlusIcon from "../icons/person-plus-fill.svg";
import xIcon from "../icons/x-lg.svg";
import { http_url, ws_url } from "../others/shared_vars";
import { useSelector, useDispatch } from "react-redux";
import { userInfoActions } from "../store/userInfo-slice";
import { statusActionsActions } from "../store/status-slice";


export default function Main ({width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, mobileViewSide, chats, setUserInfoProp, onClickFriend}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.userInfo);
  // useEffect(() => {
  //   if (mobileViewSide) MobileViewSide(mobileViewSide);}
  //   ,
  //   [mobileViewSide]
  //   );  

  function logout(){
    SaveUserInfo();
    fetch(http_url + '/chat_app/logout', 
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
      // setUserInfoProp(undefined);
      dispatch(userInfoActions.setUserInfo({username: null, token: null}));
    }).catch(error => console.error(error));
  }
  // async function logout(){
  //   let response = await fetch( http_url + '/chat_app/logout', 
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
          <div className='iconContainer' onClick={()=>ProfileOn(false)}>
            <img src={xIcon} className='icon' />
          </div>
          <div>
            Me
          </div>
        </div>
        <div className='iconContainer' onClick={async () => await logout()}>
          <img src={logoutIcon} className='icon' />
        </div>
      </div>
      <div className='userIcon large' style={{backgroundColor: StringToColor(userInfo.username)}}>
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
            <div className='iconContainer' onClick={()=>history.push('/addfriend')}>
              <img src={personPlusIcon} className='icon' />
            </div>
            <div className='iconContainer' onClick={()=>history.replace('/newchat')}>
              <img src={pencilIcon} className='icon' />
            </div>
          </div>
        </div>
        
        {/* <div>
          Signed in as: {userInfo.username}
          <div className='iconContainer'>
            <img src={logoutIcon} className='icon' onClick={async () => await logout()}/>
          </div>
        </div> */}

      </div>
        <div className='left-row2'>
          <ChatPeopleList onClickFriend={onClickFriend} showChat={showChat} setChatHistoryProp={setChatHistoryProp} rooms={rooms}/> 
        </div>
        <div className='left-row3'>
          <ChatPeopleToggle ChatPeopleSwitch={ChatPeopleSwitch}/>
        </div>
    </div>
  );
}

