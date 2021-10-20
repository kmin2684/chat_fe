import { statusActions } from "./status-slice";
import { http_url, ws_url } from "../others/shared_vars";
import store from "./index";

export const GeneralUpdate = () => {
  return async (dispatch) => {
    const state = store.getState();

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

export const FetchMessages = () => async (dispatch) => {
  const state = store.getState();
  const currentChat = state.currentChat;
  const userInfo = state.userInfo;

  const FetchData = async () => {
    const response = await fetch(
      http_url + "/chat_app/chat_update/" + currentChat,
      {
        headers: { authorization: "token " + userInfo.token },
      }
    );

    if (!response.ok) throw new Error("fetchMessage failed");

    const data = await response.json();
    return data;
  };

  if (!userInfo.token || !currentChat) return;

  try {
    data = await FetchData();
    dispatch(statusActions.setChatHistory(data));
    return true;
  } catch (err) {
    console.error(err, "error on fetchMessages");
    dispatch(statusActions.setChatHistory(null));
    return;
  }

  // if (currentChat) {
  //   if (userInfo.token) {
  //     fetch(http_url + "/chat_app/chat_update/" + currentChat, {
  //       headers: { authorization: "token " + userInfo.token },
  //     })
  //       .then((response) => {
  //         if (response.ok) return response.json();
  //         else {
  //           history.replace("/");
  //         }
  //       })
  //       .then((data) => dispatch(statusActions.setChatHistory(data)))
  //       .catch((error) => console.error(error));
  //   }
  // } else dispatch(statusActions.setChatHistory(null));
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
