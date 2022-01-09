import { createSlice } from "@reduxjs/toolkit";

const initialState = { username: null, token: null, isLoading: true };

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isLoading = action.payload.isLoading
        ? action.payload.isLoading
        : action.payload.isLoading === false
        ? action.payload.isLoading
        : state.isLoading;
    },
  },
});

export const userInfoActions = userInfoSlice.actions;

export default userInfoSlice;
