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
import ChatWindow from "../ChatWindow/ChatWindow";
import Friend from "../Friend/Friend";
import { MobileViewSide } from "../../others/shared_functions";
import { useSelector, useDispatch } from "react-redux";
import { statusActions } from "../../store/status-slice";
import xIcon from "../../icons/x-lg.svg";
import groupIcon from "../../icons/group-icon.svg";
import  {Button, IconButton, TextField }  from '@mui/material';
import arrowLeftIcon from "../../icons/arrow-left.svg";
import './NewChat.scss'
import { QueryStringGenerator } from "../../others/shared_functions"; 


export default function NewChat ({ socket, onClickFriend,  mobileViewSide}) {
  
  const sections = ['new_message','add_participants','add_title', 'send_message'];
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const friends = useSelector(state => state.status.friends);

  let queryParams = new URLSearchParams(location.search);
  let queryParamsSection = queryParams.get('section')? queryParams.get('section').trim() : '';
  let queryParamsMembers = queryParams.getAll('members');
  let queryParamsGroupName = queryParams.get('group_name')? queryParams.get('group_name').trim() : '';

  if (!sections.includes(queryParamsSection)) {
    queryParamsSection = 'new_message'
  }

  switch(queryParamsSection) {
    case 'new_message':
      queryParamsMembers = [];
      queryParamsGroupName = '';
      break;
    case 'send_message':

      queryParamsMembers = queryParamsMembers.filter(member => friends.includes(member));
      console.log("filtered members are", queryParamsMembers, queryParamsGroupName, queryParamsMembers.length);

      if (!queryParamsGroupName && queryParamsMembers.length === 1) {
        // need to check if a chat room already exists for the member
        break; 
      } else if (queryParamsGroupName && queryParamsMembers.length > 1) {
        console.log('yes!!')
        break
      } else {
        queryParamsSection = 'new_message';
        queryParamsMembers = [];
      }
      break;
    default:
      queryParamsMembers = queryParamsMembers.filter(member => friends.includes(member));  
  }

  console.log('\nsection is', queryParamsSection);

  const [section, setSection] = useState(queryParamsSection);
  const [groupName, setGroupName] = useState(queryParamsGroupName);
  const [checkedUsers, setCheckedUsers] = useState(queryParamsMembers);

  // const [section, setSection] = useState('new_message');
  // const [groupName, setGroupName] = useState('');
  // const [checkedUsers, setCheckedUsers] = useState([]);

  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [inputOn, setInputOn] = useState(null);
  const [newChatData, setNewChatData] = useState({
    newChat: true,
    groupName: null,
    members: null,
  });


  useEffect(() => {
    console.log('newchat rerendering because location.search changed');

    const queryParams = new URLSearchParams(location.search);
    let queryParamsSection = queryParams.get('section')? queryParams.get('section').trim() : '';
    let queryParamsMembers = queryParams.getAll('members');
    let queryParamsGroupName = queryParams.get('group_name')? queryParams.get('group_name').trim() : '';
  
    if (!sections.includes(queryParamsSection)) {
      queryParamsSection = 'new_message'
    }
  
    switch(queryParamsSection) {
      case 'new_message':
        queryParamsMembers = [];
        queryParamsGroupName = '';
        break;
      case 'send_message':
        
        queryParamsMembers = queryParamsMembers.filter(member => friends.includes(member));

        if (!queryParamsGroupName && queryParamsMembers.length === 1) {
          // need to check if a chat room already exists for the member
          break; 
        } else if (queryParamsGroupName && queryParamsMembers.length > 1) {
          console.log('yes!!')
          break
        } else {
          queryParamsSection = 'new_message';
          queryParamsMembers = [];
        }
        break;
      default:
        queryParamsMembers = queryParamsMembers.filter(member => friends.includes(member));  
    }

    setSection(queryParamsSection);
    setGroupName(queryParamsGroupName);
    setCheckedUsers(queryParamsMembers);

    // setSection((prevState) => {
    //   if (prevState !== queryParamsSection) return queryParamsSection;
    // });
    // setGroupName(prevState => {
    //   if (prevState !== queryParamsGroupName) return queryParamsGroupName;
    //   });
    // setCheckedUsers(prevState => {
    //   if (prevState !== queryParamsMembers) return queryParamsMembers;
    // });
  }, [location.search])

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

  // not used anymore
  function onSubmit(e) {
    console.log('onSubmit');
    e.preventDefault(); 
    if (!groupName?.trim()) return ; 
    setSection('send_message'); 
    setInputOn(true);
  }

  function JumpToSendMessage(e) {
    e.preventDefault();
    if (!groupName?.trim()) return;
    history.push("newchat?" + QueryStringGenerator('send_message', checkedUsers, groupName, friends));
  }

  function handleClick() {
    if (!groupName?.trim()) return ; 
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
      // if (section !== 'send_message') setSection('send_message');
      if (!inputOn) setInputOn(true);
      if (checkedUsers.length < 2 && location.state.user !== checkedUsers[0]) 
      setCheckedUsers([location.state.user]);
      setGroupName('');
      setSection('send_message');
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
        <div className = 'create-new-group' onClick={()=>history.push('/newchat?section=add_participants')}>
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
          <div className='iconContainer' onClick={() => history.push('/newchat?section=new_message')}> 
              <img src={arrowLeftIcon} className='icon' />
          </div>
          Add Participants
        </div>
        <Button id='next-button' onClick={()=> history.push('/newchat?' + QueryStringGenerator('add_title', checkedUsers, null, friends))} disabled={checkedUsers.length < 2}>
          NEXT
        </Button>       
      </div>
      <div className='right-row2'>
        {friends?.map(friend => {
          // const label = 'friend' + friend.id;
          // const label = friend;
          return (<>
            <div className='friend-checkbox-container'>
              <Friend 
              friend = {friend}  
              onClickFriend = {() => null}
              checked={checkedUsers.find(user => user === friend)} 
              changeCheck={() => ChangeCheck(friend)}
              />
              {/* <Checkbox label={friend} value={checkedUsers.find(user => user === friend)} changeCheck={() => ChangeCheck(friend)} /> */}
            </div>
            </>);})}
      </div>
    </div>
  )

  const add_title = (
    <div className = 'NewChat AddTitle right'>
      <div className='right-row1'>
        <div>
            <div className='iconContainer' onClick={() => history.push("/newchat?section=add_participants")}> 
                <img src={arrowLeftIcon} className='icon' />
            </div>
            Add Title
          </div>
          <Button id='create-button' onClick={()=> history.push('/newchat?' + QueryStringGenerator('send_message', checkedUsers, groupName, friends))} disabled={!groupName.trim()}>
            CREATE
          </Button> 

        {/* <button onClick={()=>setSection('add_participants')}>back</button>
        Add Title
        <button form='form1' disabled ={!groupName.trim()}> CREATE</button> */}
      </div>
      <div className='right-row2'>
        <form id="form1"  onSubmit={(e)=>{JumpToSendMessage(e)}}>
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
    inputOn={true} 
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
          {/* {label} */}
          <input type='checkbox' checked={value} onChange={changeCheck} ></input>
        </label>
      </div> 
      );
  }
  