import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./counter";
import authReducer from "./auth";
import userInfoSlice from "./userInfo-slice";

const store = configureStore({
  reducer: { userInfo: userInfoSlice.reducer },
});

export default store;
