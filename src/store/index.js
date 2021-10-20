import { configureStore } from "@reduxjs/toolkit";

// import counterReducer from "./counter";
// import authReducer from "./auth";
import userInfoSlice from "./userInfo-slice";
import statusSlice from "./status-slice";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
    status: statusSlice.reducer,
  },
});

export default store;
