import React from "react";
import './ChatPeopleToggle.css'; 

export default function ChatPeopleToggle({ChatPeopleSwitch}) {

    return <div className = 'ChatPeopleToggle'>
        <div onClick={() => ChatPeopleSwitch(true)}>
            Chat
        </div>
        <div onClick={() => ChatPeopleSwitch(false)}>
            People
        </div>
    </div>;
}