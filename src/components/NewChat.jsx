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
import Friend from "./Friend";
import { MobileViewSide } from "../others/shared_functions";
import { useSelector, useDispatch } from "react-redux";
import { statusActions } from "../store/status-slice";
import xIcon from "../icons/x-lg.svg";
import groupIcon from "../icons/group-icon.svg";
import  {Button, IconButton, TextField }  from '@mui/material';
import arrowLeftIcon from "../icons/arrow-left.svg";

export default function NewChat ({ socket, onClickFriend,  mobileViewSide}) {
  
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const friends = useSelector(state => state.status.friends);

  const [section, setSection] = useState('new_message');
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inputOn, setInputOn] = useState(null);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [newChatData, setNewChatData] = useState({
    newChat: true,
    groupName: null,
    members: null,
  })


  useEffect(() => {
    setNewChatData({...newChatData, groupName, members: checkedUsers})
  }, [checkedUsers, groupName])

  // dispatch(statusActions.setChatHistory(null));

  useEffect(() => {
    if (mobileViewSide) MobileViewSide(mobileViewSide);}
    ,[mobileViewSide]);  

  function SwitchInputOn(value) {
    setInputOn(value);
  }

  // function Change_section (current) {
  //   if (current === 'new_message') {
  //     setSection(new_message);
  //     setInputOn(false);
  //   } else if (current === 'add_participants') {
  //     setSection(add_participants);
  //     setInputOn(false);
  //   } else if (current === 'add_title') {
  //     setSection(add_title);
  //     setInputOn(false);
  //   } else if (current === 'send_message') {
  //     setInputOn(true); 
  //   }
  // }
  
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
    console.log('onSubmit');
    e.preventDefault(); 
    if (!groupName.trim()) return ; 
    setSection('send_message'); 
    setInputOn(true);
  }

  function handleClick() {
    if (!groupName.trim()) return ; 
    setSection('send_message'); 
    setInputOn(true);
  }

  // const newChatData = {
  //   newChat: true,
  //   groupName,
  //   members: checkedUsers,
  // };



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
        <div className='iconContainer xIconContainer' onClick={()=>history.push('/')}> 
            <img src={xIcon} className='icon' />
        </div>
        <div >
          New message
        </div>

        {/* <div>
          New message
        </div>
        <div>
          <button onClick={() => setSection('add_participants')}> Create a New Group </button>
          <button onClick={() => history.push('/')}>home</button>
        </div> */}
      </div>
      <div className='right-row2'>
        <div className = 'create-new-group' onClick={()=>setSection('add_participants')}>
          <div className='iconContainer group'> 
              <img src={groupIcon} className='icon' />
          </div>
          <div >
            Create a New Group
          </div>
        </div>
        <div className="suggested">
          Suggested:
        </div>
        {friends?.map(friend => { return (
          // <div onClick={()=>onClickFriend(friend)}>
          //   {friend}
          // </div>
          <Friend friend = {friend} onClickFriend={onClickFriend}/>
        );})}

      </div>
    </div>
  );

  const add_participants = (
    <div className='NewChat AddParticipants right'>
      <div className='right-row1'>
        <div>
          <div className='iconContainer' onClick={() => setSection('new_message')}> 
              <img src={arrowLeftIcon} className='icon' />
          </div>
          Add Participants
        </div>
        <Button id='next-button' onClick={()=>setSection('add_title')} disabled={checkedUsers.length < 2}>
          NEXT
        </Button>       
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
    <div className = 'NewChat AddTitle right'>
      <div className='right-row1'>
        <div>
            <div className='iconContainer' onClick={() => setSection('add_participants')}> 
                <img src={arrowLeftIcon} className='icon' />
            </div>
            Add Title
          </div>
          <Button id='create-button' onClick={handleClick} disabled={!groupName.trim()}>
            CREATE
          </Button> 

        {/* <button onClick={()=>setSection('add_participants')}>back</button>
        Add Title
        <button form='form1' disabled ={!groupName.trim()}> CREATE</button> */}
      </div>
      <div className='right-row2' onSubmit={(e)=>{onSubmit(e)}}>
        <form id="form1">
          {/* <input type='text' placeholder='Group Name (Required)' required="required" value={groupName} onChange={e=>setGroupName(e.target.value)}></input> */}
          <div className='text-field-container'>
            <TextField variant="standard" type='text' placeholder='Group Name (Required)' required="required" value={groupName} onChange={e=>setGroupName(e.target.value)} />
          </div>
        </form>
      </div>
    </div>
  );
    
  const send_message = <>
    <ChatWindow 
    // chatHistory = {chatHistory} 
    // setChatHistoryProp={setChatHistoryProp}
    inputOn={inputOn} 
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

  // if (location.state?.user && checkedUsers.length < 2 && location.state?.user !== checkedUsers[0] ) {
  //   return <div className = 'right'></div>; 
  // }



  // to directly render send_message page
  if (location.state?.user && section !== 'send_message') {
    return <div className='right'/>  ; 
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
  