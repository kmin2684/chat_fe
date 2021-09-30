import React from "react";
// import './Chat.css;'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory,
  } from "react-router-dom";

  import {StringToColor} from '../App'

export default function Chat({room, setChatHistoryProp, chat, userInfo}) {
    const history = useHistory();
    const path = "/room/" + chat.id;
    const chatName = chat.name? chat.name 
    : chat.members.length === 2 ? chat.members.find(member => member !== userInfo.username)
    : undefined

    let otherMembers = chat?.members.filter(member => member !== userInfo.username);
    
    if (otherMembers?.length > 1) {
      otherMembers = otherMembers.slice(0, 2);
    }

    return <>
      <div className='chat' onClick={()=>history.push(path)}>
        {/* {chat.member.length < 3? chat.members.map(member => member
          chat.members.map(member => )} */}
        
  
        {otherMembers.length > 1 ? (
          <div className = 'userIcon group'> 
          {otherMembers.map(member => <div className='userIcon small' style = {{backgroundColor: StringToColor(member)}}> {member[0]} </div>)}
          </div>
          )
        : otherMembers.map(member => <div className='userIcon' style = {{backgroundColor: StringToColor(member)}}> {member[0]} </div>)}
        {chatName}
      </div>
    </>
    // return <Link to={path}>
    //     <div>Chat name: {chat.name}</div>
    // </Link>;
}