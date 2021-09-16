import React, { useState, useEffect } from "react";
// import './Chat.css;'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory,
  } from "react-router-dom";


export default function ChatWindow({setCurrentChatProp, chatHistory, myID, inputOn, userInfo}) {
    let { room_id } = useParams();
    // room_id? LoadChat(room_id) : LoadChat(null);
    if (room_id) setCurrentChatProp(room_id)

    let history = useHistory();

    const messages = chatHistory?.messages?.map(message => {
        if (userInfo.username===message.sender) {
            return (
                <div className='message-block self'>
                    <div className='content'>
                        content: {message.content}
                    </div>
                    <div className='time'>
                        time: {message.time}
                    </div>
                </div>
            );
        } else {
            return (
                <div className='message-block other'>
                    <div className='sender'>
                        sender: {message.sender}
                    </div>
                    <div className='content'>
                        content: {message.content}
                    </div>
                    <div className='time'>
                        time: {message.time}
                    </div>
                </div>
            );
        }
    });

    return (
        <div className = 'right'>
            <div className = 'right-row1'>
                {room_id}
                {chatHistory?.messages && <div onClick={()=>history.push('/')}> home</div>}
            </div>
            <div className = 'right-row2'>
                {messages?messages 
                : inputOn? 'send a new message'
                : 'no message'}
            </div>
            <div className = 'right-row3'>
                {
                    (messages||inputOn)? 
                    <form onSubmit = {e => e.preventDefault()}>
                        <input type='text' placeholder='Aa'/>
                    </form>
                    : inputOn?
                    <form>
                        <input type='text' placeholder='Aa'/>
                    </form> 
                    : null                   
                }
            </div>
        </div>
    );



    // return messages? ([messages, 
    //     ])
    // : <div>no message</div>; 
}


// function a() {
//     return (
//         <>
//             <div className = 'right-row1'>
//                 {room_id?room_id : null}
//             </div>
//             <div className = 'right-row2'>
//                 {messages?messages : 'no message'}
//             </div>
//             <div className = 'right-row3'>
//                 {
//                     messages? 
//                     <form>
//                         <input type='text' placeholder='Aa'/>
//                     </form>
//                     : inputOn?
//                     <form>
//                         <input type='text' placeholder='Aa'/>
//                     </form> 
//                     : null                   
//                 }
//             </div>
//         </>
//     );
// }