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
    const [content, setContent] = useState('');
    // room_id? LoadChat(room_id) : LoadChat(null);
    if (room_id) setCurrentChatProp(room_id)
    else setCurrentChatProp(undefined)

    let history = useHistory();

    function onSubmit(e) {
        e.preventDefault();
        setContent('');
        if (content.length) {
            fetch('http://127.0.0.1:8000/chat_app/chat_update/' + room_id, {
                method: 'POST',
                headers: 
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'token '+ userInfo.token, 
                    },
                body: JSON.stringify({content}), 
            })
            .then(response => response.json())
            .then(data => console.log(data)); 
        }
    }

    function onChange(e) {
        setContent(e.target.value);
    }

    const messages = chatHistory?.messages?.map(message => {
        if (userInfo.username===message.sender) {
            return (
                <div className='message-block self'>
                    <div className = 'container'>
                        <div className='content'>
                            {message.content}
                        </div>
                    </div>
                    <div className='time'>
                        {message.time}
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
                        {message.content}
                    </div>
                    <div className='time'>
                        {message.time}
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
                    (messages||inputOn)&& 
                    <form onSubmit = {e => onSubmit(e)}>
                        <input type='text' placeholder='Aa' value={content} onChange={e => onChange(e)}/>
                    </form>
       

                    // (messages||inputOn)? 
                    // <form onSubmit = {e => e.preventDefault()}>
                    //     <input type='text' placeholder='Aa'/>
                    // </form>
                    // : inputOn?
                    // <form>
                    //     <input type='text' placeholder='Aa'/>
                    // </form> 
                    // : null                   
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