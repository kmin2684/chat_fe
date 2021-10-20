import { createSlice } from "@reduxjs/toolkit";

const initialState = { friends: [] };

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends(state, action) {
      state.friends = action.payload.friends;
    },
    addFriend(state, action) {
      state.friends = state.chats.push(action.payload);
    },
  },
});

export const friendsActions = friendsSlice.actions;

export default friendsSlice;
