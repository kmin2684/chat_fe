import { createSlice } from "@reduxjs/toolkit";

const initialState = { username: null, token: null, isLoading: true };

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: { username: null, token: null, isLoading: true },
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
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    increase(state, action) {
      state.counter = state.counter + action.payload;
    },
    toggleCounter(state) {
      state.showCounter = !state.showCounter;
    },
  },
});

export const userInfoActions = userInfoSlice.actions;

export default userInfoSlice;
