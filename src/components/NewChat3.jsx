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

export default function NewChat ({chatHistory, myID, width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, setCurrentChatProp, onClickFriend}) {
    const [section, setSection] = useState('new_message');
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const [groupName, setGroupName] = useState(null);
    const [inputOn, setInputOn] = useState(null);
    function SwitchInputOn(value) {
      setInputOn(value);
    }
  
    // console.log('NewChat mounted');

    function Change_section (current) {
      if (current === 'new_message') {
        setSection(new_message);
        setInputOn(false);
      } else if (current === 'add_participants') {
        setSection(add_participants);
        setInputOn(false);
      } else if (current === 'add_title') {
        setSection(add_title);
        setInputOn(false);
      } else if (current === 'send_message') {
        setInputOn(true); 
      }
    }
  
    useEffect(() => {
      if (section === 'send_message') {
        MobileViewSide('right');
        return;
      }
      MobileViewSide('left');
    }, [section]);

    const [checkedUsers, setCheckedUsers] = useState([]);
    function ChangeCheck(user) {
      // let checkedUsersCopy = [...checkedUsers];
      if (checkedUsers.find(e => e == user)) {
        console.log(user, 'unchecking')
        setCheckedUsers(checkedUsers.filter(e => e !== user));
      } else {
        console.log(user, 'checking')
        setCheckedUsers(checkedUsers.concat([user]));
      }
    }
    // function ChangeCheck(id) {
    //   // let checkedUsersCopy = [...checkedUsers];
    //   if (checkedUsers.find(user => user == id)) {
    //     console.log(id, 'unchecking')
    //     setCheckedUsers(checkedUsers.filter(user => user !== id));
    //   } else {
    //     console.log(id, 'checking')
    //     setCheckedUsers(checkedUsers.concat([id]));
    //   }
    // }
    const new_message = (
      <div className='NewChat left'>
        <div className='left-row1'>
          <div>
            New message
          </div>
          <div>
            <button onClick={() => setSection('add_participants')}> Create a New Group </button>
          </div>
        </div>
        <div className='left-row2'>
          <div>
            Suggested:
          </div>
          {friends?.map(friend => { return (
            <div onClick = {()=>onClickFriend({friend})}>
              {friend}
            </div>
          );})}
  
        </div>
      </div>
    );
  
    const add_participants = (
      <div className='AddParticipants left'>
        <div className='left-row1'>
          <button onClick={() => setSection('new_message')}>
            back
          </button>
            Add Participants
          <button onClick={()=>setSection('add_title')}>
            NEXT
          </button>
        </div>
        <div className='left-row2'>
          {friends?.map(friend => {
            // const label = 'friend' + friend.id;
            // const label = friend;
            return (
              <Checkbox label={friend} value={checkedUsers.find(user => user === friend)} changeCheck={() => ChangeCheck(friend)} />
            );})}
        </div>
      </div>
    )
  
    const add_title = (
      <div className = 'AddTitle left'>
        <div className='left-row1'>
          <button onClick={()=>setSection('add_participants')}>back</button>
          Add Title
          <button onClick={()=>{setSection('send_message'); setInputOn(true)}}> CREATE</button>
        </div>
        <div className='left-row2'>
          <input type='text' placeholder='Group Name (Required)'></input>
        </div>
      </div>
    );
    
    // let page = null; 
  
    // if (section === 'new_message') {
    //   page = new_message;
    // } else if (section === 'add_participants') {
    //   page = add_participants;
    // } else if (section === 'add_title') {
    //   page = add_title;
    // }
    
    const page = 
    section === 'new_message'? new_message
    : section === 'add_participants'? add_participants
    : section === 'add_title'? add_title
    : section === 'send_message'? 
    //   <LeftWindow 
    //   width = {width} 
    //   showChat = {showChat} 
    //   LoadChat = {LoadChat} 
    //   ChatPeopleSwitch = {ChatPeopleSwitch}
    //   rooms = {rooms}
    //   friends = {friend_list}
    //   />
    <div className = 'NewChat left'> send a new message from the right window </div>
    : null; 
  
    return [page, <ChatWindow 
      chatHistory = {chatHistory} 
      setChatHistoryProp={setChatHistoryProp}
      myID={myID} 
      inputOn={inputOn} 
      setCurrentChatProp={setCurrentChatProp}
      // mess = {console.log('ChatWindow mounted')}
      />]; 
 
  }
  
  function Checkbox ({label, value, changeCheck}) {
    return (
      <div className='group-participant'>
        <label>
          {label}
          <input type='checkbox' checked={value} onChange={changeCheck} ></input>
        </label>
      </div> 
      );
    }
  