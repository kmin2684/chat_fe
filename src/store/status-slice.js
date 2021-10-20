import { createSlice } from "@reduxjs/toolkit";

const initialState = { chats: [], friends: [] };

const statusSlice = createSlice({
  name: "status",
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
    increment(state) {
      state.counter++;
    },
  },
});

export const statusActions = statusSlice.actions;

export default statusSlice;
