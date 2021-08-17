import React from "react";
// import './ChatPeopleList.css'
import Friend from "./Friend.jsx"
import Chat from "./Chat.jsx"



export default function ChatPeopleList({showChat, LoadChat, rooms, friends}) {
   // chats = rooms.map(room => {
   //    return <Chat content = {'chat-'+room.id} LoadChat = {LoadChat}/>
   // });

   return showChat?  
      rooms.map(room => {
         return <Chat room = {room} LoadChat = {LoadChat}/>
      })
       : 
      friends.map(friend => {
         return <Friend friend = {friend}/>
      })

   //     (
   //    <>
   //       <Friend />
   //       <Friend />
   //    </>
   // )

   // const friend_list = (
   //    <>
   //       <Friend />
   //       <Friend />
   //    </>
   // )
   ;

   
   // const chat_list = (
   //    <>
   //       <Chat content = {'c1'} LoadChat = {LoadChat}/>
   //       <Chat content = {'c2'} LoadChat = {LoadChat}/>
   //    </>
   // );

   // return showChat? chat_list : friend_list;
}

      // <> 
      //    <Chat content = {'c1'} LoadChat = {LoadChat}/>
      //    <Chat content = {'c2'} LoadChat = {LoadChat}/>
      // </>