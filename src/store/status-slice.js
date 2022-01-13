import { createSlice } from "@reduxjs/toolkit";

function SortByTime(a, b) {
  return (
    new Date(b.last_message.time).getTime() -
    new Date(a.last_message.time).getTime()
  );
}

const initialState = {
  chats: [],
  friends: [],
  currentChat: null,
  chatHistory: null,
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload.chats.sort(SortByTime);
    },
    addChat(state, action) {
      state.chats.push(action.payload);
    },
    setFriends(state, action) {
      state.friends = action.payload.friends;
    },
    addFriend(state, action) {
      state.friends.push(action.payload);
    },
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    setChatHistory(state, action) {
      state.chatHistory = action.payload;
    },
  },
});

export const statusActions = statusSlice.actions;

export default statusSlice;
