import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import ChatWindow from "./ChatWindow";

export default function NewChat ({chatHistory, myID, width, showChat, LoadChat, ChatPeopleSwitch, rooms, friends}) {
    const [section, setSection] = useState('new_message');
    const [groupName, setGroupName] = useState(null);
    const [inputOn, setInputOn] = useState(null);
    function SwitchInputOn(value) {
      setInputOn(value);
    }
  
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
  
    const [checkedUsers, setCheckedUsers] = useState([]);
    function ChangeCheck(id) {
      // let checkedUsersCopy = [...checkedUsers];
      if (checkedUsers.find(user => user == id)) {
        console.log(id, 'unchecking')
        setCheckedUsers(checkedUsers.filter(user => user !== id));
      } else {
        console.log(id, 'checking')
        setCheckedUsers(checkedUsers.concat([id]));
      }
    }
    
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
          {friends.map(friend => { return (
            <div>
              friend {friend.id}
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
          {friends.map(friend => {
            const label = 'friend' + friend.id;
            return (
              <Checkbox label={label} value={checkedUsers.find(user => user === friend.id)} changeCheck={() => ChangeCheck(friend.id)} />
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
    "send a new message from the right window"
    : null; 
  
    return [page, <ChatWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID} inputOn={inputOn}/>]; 
 
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
  