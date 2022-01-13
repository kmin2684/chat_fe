import React from "react";
import {
    useHistory,
  } from "react-router-dom";

import {StringToColor} from '../../others/shared_functions';
import { useSelector } from "react-redux";
import './Chat.scss';


function formatTime(timeInput) {
  const current = new Date();
  const time = new Date(timeInput);
  const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthMap[time.getMonth()];

  if (current.getFullYear() !== time.getFullYear()) return `${month} ${time.getDate()} ${time.getFullYear()}`
  else if (current.getMonth() !== time.getMonth()) return `${month} ${time.getDate()}`;
  else if (current.getDate() === time.getDate()) {
    if (time.getHours() === 0) return `${12}:${time.getMinutes()} AM`;
    else if (time.getHours() < 12) return `${time.getHours()}:${time.getMinutes()} AM`;
    else if (time.getHours() === 12) return `${time.getHours()}:${time.getMinutes()} PM`;
    return `${time.getHours()-12}:${time.getMinutes()} PM`;
  }
  return `${month} ${time.getDate()}`;
}


export default function Chat({chat}) {
    const history = useHistory();
    const userInfo = useSelector(state => state.userInfo);
    const path = "/room/" + chat.id;
    const chatName = chat.name? chat.name 
    : chat.members?.length === 2 ? chat.members.find(member => member !== userInfo.username)
    : undefined;

    let otherMembers = chat?.members.filter(member => member !== userInfo.username);
    
    if (otherMembers?.length > 1) otherMembers = otherMembers.slice(0, 2);
 

    return <>
      <div className='chat' onClick={()=>history.push(path)}>      
        {otherMembers.length > 1 ? (
          <div className = 'userIcon group'> 
          {otherMembers.map(member => <div key={member} className='userIcon small' style = {{backgroundColor: StringToColor(member)}}> {member[0]} </div>)}
          </div>
          )
        : otherMembers.map(member => 
        <div key={member} className='userIcon' style = {{backgroundColor: StringToColor(member)}}> 
          {member[0]} 
        </div>)}
        <div style={{overflow:'hidden'}}>
          <div>{chatName}</div>
          <div style={{display: 'flex'}}>
            <div className='content'>{chat.last_message?.content}</div>
            <div className='time' >
              {chat.last_message?.time && 
              `· ${formatTime(chat.last_message.time)}`
              }
              
              </div>
          </div> 

        </div>
        
      </div>
    </>
}