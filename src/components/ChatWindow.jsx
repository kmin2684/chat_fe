import React, { useState, useEffect } from "react";
// import './Chat.css;'

export default function ChatWindow({chatHistory, myID, room_id, inputOn}) {
    const messages = chatHistory?.messages?.map(message => {
        if (myID===message.sender) {
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
        <>
            <div className = 'right-row1'>
                {room_id}
            </div>
            <div className = 'right-row2'>
                {messages?messages : 'no message'}
            </div>
            <div className = 'right-row3'>
                {
                    (messages||inputOn)? 
                    <form>
                        <input type='text' placeholder='Aa'/>
                    </form>
                    : inputOn?
                    <form>
                        <input type='text' placeholder='Aa'/>
                    </form> 
                    : null                   
                }
            </div>
        </>
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