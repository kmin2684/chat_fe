import { configureStore } from "@reduxjs/toolkit";
import chatsFriendsSlice from "./chatsFriends-slice";

// import counterReducer from "./counter";
// import authReducer from "./auth";
import userInfoSlice from "./userInfo-slice";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    chatsFriends: chatsFriendsSlice.reducer,
  },
});

export default store;
