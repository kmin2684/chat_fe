import React, { useState, useEffect, useRef } from "react";
// import './Chat.css;'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory,
  } from "react-router-dom";


export default function ChatWindow({setCurrentChatProp, chatHistory, myID, inputOn, userInfo, socket, newChatData}) {
    let { room_id } = useParams();
    let history = useHistory();
    const [content, setContent] = useState('');
    const scroll = useRef(null);
    const [disabled, setDisabled] = useState(false);
    useEffect(()=> {
        scroll.current.scrollTop = scroll.current.scrollHeight;
    },[chatHistory])

    if (room_id) setCurrentChatProp(room_id)
    else setCurrentChatProp(undefined)

    function sendMessage(e) {
        e.preventDefault();
        if(socket && room_id && content.trim().length) {
            if(typeof socket === 'object'){
                socket.send(JSON.stringify({message: content, room_id}))   
            }
        } else if(socket && newChatData && content.trim().length) {
            console.log("new chat sent: ", {...newChatData, message: content});
            socket.send(JSON.stringify({...newChatData, message: content})); 
            setDisabled(false);        
        }
        setContent('');
    }
    // const newChatData = {
    //     newChat: true,
    //     groupName,
    //     members: checkedUsers,
    //   };

    function onSubmit(e) {
        e.preventDefault();
        if (content.trim().length) {
            console.log(content);
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
            .then((data) => {
                console.log(data);
                
            }); 
        }
        setContent('');
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
            <div className = 'right-row2' ref = {scroll}>
                {messages?messages 
                : inputOn? 'send a new message'
                : 'no message'}
            </div>
            <div className = 'right-row3'>
                {
                    (messages||inputOn)&& 
                    <form onSubmit = {e => sendMessage(e)}>
                        <input disabled={disabled} type='text' placeholder='Aa' value={content} onChange={e => onChange(e)}/>
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