import { userInfoActions } from "./userInfo-slice";
import { statusActions } from "./status-slice";
import { http_url } from "../others/shared_vars";
import store from "./index";

export const fetchUserInfo = () => {
  return async (dispatch) => {
    if (typeof Storage === "undefined") {
      console.log("storage undefined");
      dispatch(
        userInfoActions.setUserInfo({
          username: null,
          token: null,
          isLoading: false,
        })
      );
      return;
    }

    if (!localStorage.ChatUserInfo) {
      console.log("localStorage.ChatUserInfo is undefined");
      dispatch(
        userInfoActions.setUserInfo({
          username: null,
          token: null,
          isLoading: false,
        })
      );
    }

    const fetchData = async (storedInfo) => {
      console.log("stored info", storedInfo);
      const response = await fetch(http_url + "/chat_app/user_check", {
        method: "GET",
        headers: { Authorization: "token " + storedInfo.token },
      });
      if (!response.ok) {
        throw new Error("Could not fetch user info!");
      }

      const data = await response.json();

      if (!data.username) {
        throw new Error("user check failed");
      }

      return data;
    };

    const storedInfo = JSON.parse(localStorage.ChatUserInfo);

    try {
      const userData = await fetchData(storedInfo);
      console.log("userData", userData);
      dispatch(
        userInfoActions.setUserInfo({
          username: userData.username,
          token: storedInfo.token,
          isLoading: false,
        })
      );
    } catch (error) {
      console.error(error.message, "fetchUserInfo failed");

      dispatch(
        userInfoActions.setUserInfo({
          username: null,
          token: null,
          isLoading: false,
        })
      );
    }
  };
};

export const GeneralUpdate = () => {
  return async (dispatch) => {
    const state = store.getState();
    console.log("general update state", state);
    const fetchData = async () => {
      const response = await fetch(http_url + "/chat_app/general_update", {
        method: "GET",
        headers: { Authorization: "token " + state.userInfo.token },
      });

      if (!response.ok) throw new Error("GeneralUpdate failed");

      const data = await response.json();
      return data;
    };

    try {
      console.log("\n\n\n general update \n\n\n");
      const data = await fetchData();
      console.log(data.rooms);
      console.log(data.friends);
      dispatch(
        statusActions.setChats({
          chats: data.rooms,
        })
      );
      dispatch(
        statusActions.setFriends({
          friends: data.friends,
        })
      );
    } catch (error) {
      console.error(error.message, "GeneralUpdate failed");
    }
  };
};
