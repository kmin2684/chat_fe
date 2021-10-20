import { userInfoActions } from "./userInfo-slice";
import { http_url, ws_url } from "../others/shared_vars";

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

    let storedInfo = JSON.parse(localStorage.ChatUserInfo);

    try {
      const userData = await fetchData(storedInfo);
      console.log("userData", userData);
      dispatch(
        userInfoActions.setUserInfo({
          username: userData.username,
          token: userData.token,
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

// export const fetchCartData = () => {
//     return async (dispatch) => {
//       const fetchData = async () => {
//         const response = await fetch(
//           'https://react-http-6b4a6.firebaseio.com/cart.json'
//         );

//         if (!response.ok) {
//           throw new Error('Could not fetch cart data!');
//         }

//         const data = await response.json();

//         return data;
//       };

//       try {
//         const cartData = await fetchData();
//         dispatch(
//           cartActions.replaceCart({
//             items: cartData.items || [],
//             totalQuantity: cartData.totalQuantity,
//           })
//         );
//       } catch (error) {
//         dispatch(
//           uiActions.showNotification({
//             status: 'error',
//             title: 'Error!',
//             message: 'Fetching cart data failed!',
//           })
//         );
//       }
//     };
//   };
