import React from "react";
// import './Chat.css;'

export default function ChatWindow({chatHistory}) {
    const messages = chatHistory?.messages?.map(message => {
            return (
                <div>
                    <div>
                        sender: {message.sender}
                    </div>
                    <div>
                        content: {message.content}
                    </div>
                    <div>
                        time: {message.time}
                    </div>
                </div>
            );
        });
    
    return messages? messages : <div>no message</div>; 

    // return <div>
    //     <div>
    //         sender:
    //     </div>
    //     <div>
    //         content:
    //     </div>
    //     <div>
    //         time: 
    //     </div>

    // </div>
    // ;
}