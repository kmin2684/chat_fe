import React from "react";
import './ChatPeopleToggle.css'; 
import chat_fill from '../../icons/chat-fill.svg'
import people_fill from '../../icons/people-fill.svg'

export default function ChatPeopleToggle({ChatPeopleSwitch}) {

    return <div className = 'ChatPeopleToggle'>
        <div onClick={() => ChatPeopleSwitch(true)}>
            <img className='chat_fill' src={chat_fill}/>
            <div>Chat</div>
        </div>
        <div onClick={() => ChatPeopleSwitch(false)}>
            <img className='people_fill' src={people_fill}/>
            <div>People</div>
        </div>
    </div>;
}