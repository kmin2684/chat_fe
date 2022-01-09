import React, { useState, useEffect} from "react";
import {
  useHistory,
  useLocation
} from "react-router-dom";
import ChatWindow from "../ChatWindow/ChatWindow";
import Friend from "../Friend/Friend";
import { MobileViewSide } from "../../others/shared_functions";
import { useSelector} from "react-redux";
import xIcon from "../../icons/x-lg.svg";
import groupIcon from "../../icons/group-icon.svg";
import  {Button, TextField }  from '@mui/material';
import arrowLeftIcon from "../../icons/arrow-left.svg";
import './NewChat.scss'
import { QueryStringGenerator } from "../../others/shared_functions"; 

const sections = ['new_message','add_participants','add_title', 'send_message'];

export default function NewChat ({ socket, onClickFriend,  mobileViewSide}) {

  const location = useLocation();
  const history = useHistory();
  const friends = useSelector(state => state.status.friends);

  let queryParams = new URLSearchParams(location.search);
  let queryParamsSection = queryParams.get('section')? queryParams.get('section').trim() : '';
  let queryParamsMembers = queryParams.getAll('members');
  let queryParamsGroupName = queryParams.get('group_name')? queryParams.get('group_name').trim() : '';

  if (!sections.includes(queryParamsSection)) {
    queryParamsSection = 'new_message';
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

  console.log('\nsection is', queryParamsSection);

  const [section, setSection] = useState(queryParamsSection);
  const [groupName, setGroupName] = useState(queryParamsGroupName);
  const [checkedUsers, setCheckedUsers] = useState(queryParamsMembers);

  const [newChatData, setNewChatData] = useState({
    newChat: true,
    groupName: null,
    members: null,
  });

  useEffect(() => {
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

  }, [location.search, friends, sections])

  useEffect(() => {
    setNewChatData( (prev) => {return {...prev, groupName, members: checkedUsers}})
  }, [checkedUsers, groupName])


  useEffect(() => {
    if (mobileViewSide) MobileViewSide(mobileViewSide);}
    ,[mobileViewSide]);  


  function ChangeCheck(user) {
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


  function JumpToSendMessage(e) {
    e.preventDefault();
    if (!groupName?.trim()) return;
    history.push("newchat?" + QueryStringGenerator('send_message', checkedUsers, groupName, friends));
  }

  const new_message = (
    <div className='NewChat right'>
      <div className='right-row1'>
        <div className='iconContainer xIconContainer' onClick={()=>history.push('/')}> 
            <img src={xIcon} className='icon' alt="x icon"/>
        </div>
        <div >
          New message
        </div>
      </div>
      <div className='right-row2'>
        <div className = 'create-new-group' onClick={()=>history.push('/newchat?section=add_participants')}>
          <div className='iconContainer group'> 
              <img src={groupIcon} className='icon' alt="group icon"/>
          </div>
          <div >
            Create a New Group
          </div>
        </div>
        <div className="suggested">
          Suggested:
        </div>
        {friends?.map(friend => { return (
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
              <img src={arrowLeftIcon} className='icon' alt="left arrow"/>
          </div>
          Add Participants
        </div>
        <Button id='next-button' onClick={()=> history.push('/newchat?' + QueryStringGenerator('add_title', checkedUsers, null, friends))} disabled={checkedUsers.length < 2}>
          NEXT
        </Button>       
      </div>
      <div className='right-row2'>
        {friends?.map(friend => {
          return (<>
            <div className='friend-checkbox-container'>
              <Friend 
              friend = {friend}  
              onClickFriend = {() => null}
              checked={checkedUsers.find(user => user === friend)} 
              changeCheck={() => ChangeCheck(friend)}
              />
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
                <img src={arrowLeftIcon} className='icon' alt='left arrow'/>
            </div>
            Add Title
          </div>
          <Button id='create-button' onClick={()=> history.push('/newchat?' + QueryStringGenerator('send_message', checkedUsers, groupName, friends))} disabled={!groupName.trim()}>
            CREATE
          </Button> 

      </div>
      <div className='right-row2'>
        <form id="form1"  onSubmit={(e)=>{JumpToSendMessage(e)}}>
          <div className='text-field-container'>
            <TextField variant="standard" type='text' placeholder='Group Name (Required)' required="required" value={groupName} onChange={e=>setGroupName(e.target.value)} />
          </div>
        </form>
      </div>
    </div>
  );
    
  const send_message = <>
    <ChatWindow 
    inputOn={true} 
    newChatData={newChatData}
    socket={socket}
    />
  </>;
    
  const page = 
  section === 'new_message'? new_message
  : section === 'add_participants'? add_participants
  : section === 'add_title'? add_title
  : section === 'send_message'? send_message
  : null; 

  return page; 
  }
  
  