import React from "react";
// import './ChatPeopleList.css'
import Friend from "./Friend.jsx"
import Chat from "./Chat.jsx"
import { useSelector, useDispatch } from "react-redux";


export default function ChatPeopleList({showChat, setChatHistoryProp, rooms, onClickFriend}) {
   // chats = rooms.map(room => {
   //    return <Chat content = {'chat-'+room.id} LoadChat = {LoadChat}/>
   // });
   const userInfo = useSelector(state => state.userInfo);
   const chats = useSelector(state => state.chats.chats);
   const friends = useSelector(state => state.friends.friends);

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
         return <Friend friend = {friend} onClickFriend={onClickFriend}/>
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