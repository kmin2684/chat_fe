import { createSlice } from "@reduxjs/toolkit";

const initialState = { chats: [], friends: [] };

const chatsFriendsSlice = createSlice({
  name: "chatsFriends",
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload.chats;
    },
    addChat(state, action) {
      state.chats = state.chats.push(action.payload);
    },
    setFriends(state, action) {
      state.friends = action.payload.friends;
    },
    addFriend(state, action) {
      state.friends = state.chats.push(action.payload);
    },
    increment(state) {
      state.counter++;
    },
  },
});

export const chatsFriendsActions = chatsFriendsSlice.actions;

export default chatsFriendsSlice;
