import React from "react";
import Friend from "../Friend/Friend"
import Chat from "../Chat/Chat"
import { useSelector} from "react-redux";


export default function ChatPeopleList({showChat, setChatHistoryProp, onClickFriend}) {

   const chats = useSelector(state => state.status.chats);
   const friends = useSelector(state => state.status.friends);

   if (showChat) {
      if (chats?.length) {
         return chats.map(chat => {
            return <Chat key={chat.id} chat = {chat} setChatHistoryProp = {setChatHistoryProp}/>
         });     
      } 
      return 'no chats exist for the user yet';
   } 
   
   if (friends?.length) {
      return friends.map(friend => {
         return <Friend key={friend} friend = {friend} onClickFriend={onClickFriend}/>
      })
   }
   return 'no friends exist for the user yet';
}

