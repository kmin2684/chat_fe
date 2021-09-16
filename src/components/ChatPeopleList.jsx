import React from "react";
// import './ChatPeopleList.css'
import Friend from "./Friend.jsx"
import Chat from "./Chat.jsx"



export default function ChatPeopleList({showChat, setChatHistoryProp, rooms, friends, chats}) {
   // chats = rooms.map(room => {
   //    return <Chat content = {'chat-'+room.id} LoadChat = {LoadChat}/>
   // });

   if (showChat) {
      if (chats) {
         return chats.map(chat => {
            return <Chat chat = {chat} setChatHistoryProp = {setChatHistoryProp}/>
         });     
      } 
      return 'no chats';
   } 
   
   if (friends) {
      return friends.map(friend => {
         return <Friend friend = {friend}/>
      })
   }
   return 'no friends';
   

   // return showChat?  
   //    chats?.map(chat => {
   //       return <Chat chat = {chat} setChatHistoryProp = {setChatHistoryProp}/>
   //    })
   //     : 
   //    friends.map(friend => {
   //       return <Friend friend = {friend}/>
   //    })

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