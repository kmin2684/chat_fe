import ChatPeopleList from "../ChatPeopleList/ChatPeopleList";
import ChatPeopleToggle from "../ChatPeopleToggle/ChatPeopleToggle";
import React, { useState} from "react";
import {
  useHistory,
} from "react-router-dom";
import { SaveUserInfo, StringToColor } from "../../others/shared_functions";
import logoutIcon from "../../icons/log-out.svg";
import pencilIcon from "../../icons/pencil-fill.svg";
import personPlusIcon from "../../icons/person-plus-fill.svg";
import xIcon from "../../icons/x-lg.svg";
import { http_url } from "../../others/shared_vars";
import { useSelector} from "react-redux";
import './Main.scss';

export default function Main ({setChatHistoryProp, rooms, onClickFriend}) {
  const history = useHistory();
  const userInfo = useSelector(state => state.userInfo);
  const [showChat, setShowChat] = useState(true);

  function ChatPeopleSwitch(value) {
    setShowChat(value);
  }

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
      window.location.reload();
    }).catch(error => console.error(error));
  }

  const profilePage = 
    <div className = 'profile-page'>
      <div className = 'profile-header'>
        <div className = 'profile-header-left'>
          <div className='iconContainer' onClick={()=>ProfileOn(false)}>
            <img src={xIcon} className='icon' alt='X icon' />
          </div>
          <div>
            Me
          </div>
        </div>
        <div className='iconContainer' onClick={async () => await logout()}>
          <img src={logoutIcon} className='icon' alt='log out'/>
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
    <div className = 'left Main'>
      {profilePage}
      <div className='left-row1'>
        <div className = "Header">
          <div className = 'Header-left'>
            <div className='userIcon' style={{backgroundColor: StringToColor(userInfo.username)}} onClick={()=>ProfileOn(true)}>
                {userInfo.username[0]}
            </div>
            {showChat? 'Chats' : 'People'}
          </div>
          <div className='buttons'>
            <div className='iconContainer' onClick={()=>history.push('/addfriend')}>
              <img src={personPlusIcon} className='icon' alt='add friend icon' />
            </div>
            <div className='iconContainer' onClick={()=>history.push('/newchat?section=new_message')}>
              <img src={pencilIcon} className='icon' alt='pencil icon'/>
            </div>
          </div>
        </div>
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

