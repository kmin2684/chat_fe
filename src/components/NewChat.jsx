import React, { useState, useEffect, Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
  useLocation
} from "react-router-dom";
import ChatWindow from "./ChatWindow";
import { MobileViewSide } from "../App";

export default function NewChat ({chatHistory, myID, width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, setCurrentChatProp, socket, onClickFriend, SetChatHistoryProp, mobileViewSide}) {
  SetChatHistoryProp(undefined);
  
  const location = useLocation();
  const history = useHistory();
  const [section, setSection] = useState('new_message');
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inputOn, setInputOn] = useState(null);
  const [checkedUsers, setCheckedUsers] = useState([]);

  useEffect(() => {
    if (mobileViewSide) MobileViewSide(mobileViewSide);}
    ,
    [mobileViewSide]
    );  

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

  useEffect(()=>{
    MobileViewSide('right');
  },[section]);

    // console.log('NewChat mounted');


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

  function onSubmit(e) {
    e.preventDefault(); 
    if (!groupName.trim()) return
    setSection('send_message'); 
    setInputOn(true);
  }

  const newChatData = {
    newChat: true,
    groupName,
    members: checkedUsers,
  };



  useEffect(()=>{
    // if (location.state) {
    //   console.log('location found');
    //   setSection('send_message');
    //   setCheckedUsers([location.state.user]);
    //   setInputOn(true);
    // }

    if (location.state?.user) {
      console.log('location found', location.state.user);
      if (section !== 'send_message') setSection('send_message');
      if (!inputOn) setInputOn(true);
      if (checkedUsers.length < 2 && location.state.user !== checkedUsers[0]) 
      setCheckedUsers([location.state.user]);
      setGroupName('');
    }
  }, [location]);  


    // if (location.state?.user) {
    //   console.log('location found');
    //   if (section !== 'send_message') setSection('send_message');
    //   if (!inputOn) setInputOn(true);
    //   if ([location.state.user] !== checkedUsers) 
    //   setCheckedUsers([location.state.user]);
    // }
  


  const new_message = (
    <div className='NewChat right'>
      <div className='right-row1'>
        <div>
          New message
        </div>
        <div>
          <button onClick={() => setSection('add_participants')}> Create a New Group </button>
          <button onClick={() => history.push('/')}>home</button>
        </div>
      </div>
      <div className='right-row2'>
        <div>
          Suggested:
        </div>
        {friends?.map(friend => { return (
          <div onClick={()=>onClickFriend(friend)}>
            {friend}
          </div>
        );})}

      </div>
    </div>
  );

  const add_participants = (
    <div className='AddParticipants right'>
      <div className='right-row1'>
        <button onClick={() => setSection('new_message')}>
          back
        </button>
          Add Participants
        <button onClick={()=>setSection('add_title')} disabled={checkedUsers.length < 2}>
          NEXT
        </button>
      </div>
      <div className='right-row2'>
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
    <div className = 'AddTitle right'>
      <div className='right-row1'>
        <button onClick={()=>setSection('add_participants')}>back</button>
        Add Title
        <button form='form1' disabled ={!groupName.trim()}> CREATE</button>
      </div>
      <div className='right-row2' onSubmit={(e)=>{onSubmit(e)}}>
        <form id="form1">
          <input type='text' placeholder='Group Name (Required)' required="required" value={groupName} onChange={e=>setGroupName(e.target.value)}></input>
        </form>
      </div>
    </div>
  );
    
  const send_message = <>
    <ChatWindow 
    chatHistory = {chatHistory} 
    setChatHistoryProp={setChatHistoryProp}
    myID={myID} 
    inputOn={inputOn} 
    setCurrentChatProp={setCurrentChatProp}
    newChatData={newChatData}
    socket={socket}
    />
  </>;

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
  : section === 'send_message'? send_message
  : null; 

  if (location.state?.user && checkedUsers.length < 2 && location.state?.user !== checkedUsers[0] ) {
    return <div className = 'right'></div>; 
  }


  return page; 
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
  