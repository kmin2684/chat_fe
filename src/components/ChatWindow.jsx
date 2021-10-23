import React, { useState, useEffect, useRef } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory,
  } from "react-router-dom";
import TimeAgo from 'timeago-react';
import xIcon from "../icons/x-lg.svg";
import infoIcon from "../icons/info.svg";
import { MobileViewSide } from "../others/shared_functions";
import { http_url, ws_url } from "../others/shared_vars";
import { useSelector, useDispatch } from "react-redux";
import {statusActions} from "../store/status-slice";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import ChatWindowModal from './ChatWindowModal';
import {GetChatTitle} from '../others/shared_functions';



export default function ChatWindow({inputOn, socket, newChatData, mobileViewSide}) {


    const { room_id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const userInfo = useSelector(state => state.userInfo);
    const chatHistory = useSelector(state => state.status.chatHistory);
    const currentChat = useSelector(state=> state.status.currentChat);
    const chats = useSelector(state => state.status.chats);

    const [chatTitle, setChatTitle] = useState(null);
    const [content, setContent] = useState('');
    const scroll = useRef(null);
    const [disabled, setDisabled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    function setModalOpenProp (value) {
        setModalOpen(value);
    }

    useEffect(()=> {
        scroll.current.scrollTop = scroll.current.scrollHeight;
    },[chatHistory])

    useEffect(() => {
        if (mobileViewSide) MobileViewSide(mobileViewSide);}
    ,[mobileViewSide]);  

    useEffect(()=>{
    if (room_id) {
        dispatch(statusActions.setCurrentChat(room_id));
        // setChatTitle(GetChatTitle(currentChat, chats, userInfo));
    }
    else dispatch(statusActions.setCurrentChat(null));

        return () =>{
            dispatch(statusActions.setCurrentChat(null));
        }
    },[room_id])

    useEffect(()=>
    {

        if (newChatData?.groupName) {
            setChatTitle(newChatData.groupName);
        } else if(newChatData?.members) {
            setChatTitle(newChatData.members[0]);
        } else {
            setChatTitle(GetChatTitle(currentChat, chats, userInfo));
        }
        
    }, [currentChat, newChatData]
    )



    // if (room_id) setCurrentChatProp(room_id)
    // else setCurrentChatProp(undefined)
    
    // if (room_id) dispatch(statusActions.setCurrentChat(room_id));
    // else dispatch(statusActions.setCurrentChat(null));

    useEffect(() => {
        console.log('newChatData', newChatData);
        console.log('currentChat', currentChat);
        if (newChatData?.members) {
            console.log('changing chat history', newChatData);
            dispatch(statusActions.setChatHistory({members: newChatData.members}));
        }

    }, [newChatData])


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
            fetch( http_url + '/chat_app/chat_update/' + room_id, {
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

    const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone; 

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
                        {/* {convertTZ(message.time, localTZ).getHours()} */}
                        <TimeAgo datetime={message.time}/>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='message-block other'>
                    <div className='sender'>
                        {message.sender}
                    </div>
                    <div className='content'>
                        {message.content}
                    </div>
                    <div className='time'>
                        <TimeAgo datetime={message.time}/>
                    </div>
                </div>
            );
        }
    });

    return (
        <div className = 'right chat-window'>
            <div className = 'right-row1 chat-header'>               
                {/* {newChatData && <div onClick={()=>history.push('/')}> home</div>} */}
                
                {(chatHistory || newChatData) && <>
                    <div>
                        <div className='iconContainer xIconContainer' onClick={()=>history.push('/')}> 
                            <img src={xIcon} className='icon' />
                        </div>
                        <div className='chatTitle'>
                            {/* {chatHistory?.messages ? chatTitle
                            :newChatData? newChatData.groupName
                            : null    
                        } */}
                        {chatTitle}
                        </div>
                    </div>
                    <div className='iconContainer' onClick={()=>setModalOpen(true)}> 
                        <img src={infoIcon} className='icon' />
                    </div>
                    </>}
            </div>
            <div className = 'right-row2' ref = {scroll}>
                {messages?messages 
                : inputOn? <div className='greyed-out'>send a new message</div>
                : <div className='greyed-out'>There are no messages to display. Please select a chat to display messages.</div>}
            </div>
            <div className = 'right-row3'>
                {
                    (messages||inputOn)&& 
                    <form onSubmit = {e => sendMessage(e)} autocomplete="off">
                        <div>
                           <TextField id="outlined-basic" type="text" disabled={disabled} placeholder='Aa' value={content} onChange={e => onChange(e)}/>
                        </div>
                    </form>            
                }
            </div>
            < ChatWindowModal 
                modalOpen={modalOpen}
                setModalOpenProp={setModalOpenProp}
            />
        </div>
    );
}
