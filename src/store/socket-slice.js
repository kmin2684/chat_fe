import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload.chats;
    },
    addChat(state, action) {
      state.chats.push(action.payload);
    },
    setFriends(state, action) {
      state.friends = action.payload.friends;
    },
    addFriend(state, action) {
      state.chats.push(action.payload);
    },
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    setChatHistory(state, action) {
      state.chatHistory = action.payload;
    },
    increment(state) {
      state.counter++;
    },
  },
});

export const statusActions = statusSlice.actions;

export default statusSlice;
