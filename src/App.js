import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import NewChat from "./components/NewChat/NewChat";
import AddFriend from "./components/AddFriend/AddFriend";
import Spinner from "./components/Spinner/Spinner";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import Main from "./components/Main/Main";
// import { room1, room2, friend_list, room_list, userInfo2 } from "./test_vars";
import { http_url, ws_url } from "./others/shared_vars";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useSelector, useDispatch } from "react-redux";
import {
  StringToColor,
  MobileViewSide,
  SaveUserInfo,
  GetChatTitle,
} from "./others/shared_functions";
import {
  fetchUserInfo,
  GeneralUpdate,
  FetchMessages,
} from "./store/userInfo-actions";
import { statusActions } from "./store/status-slice";

export default function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userInfo);
  const chats = useSelector((state) => state.status.chats);
  const friends = useSelector((state) => state.status.friends);
  const currentChat = useSelector((state) => state.status.currentChat);
  const chatHistory = useSelector((state) => state.status.chatHistory);

  const [socket, setSocket] = useState({});

  // open and close socket
  useEffect(() => {
    if (!userInfo.token) {
      return;
    }
    dispatch(GeneralUpdate());
    const tempSocket = new W3CWebSocket(
      ws_url + "/ws/chat/?token=" + userInfo.token
    );
    setSocket(tempSocket);

    return () => {
      if ("close" in tempSocket) {
        console.log("closing socket", tempSocket);
        tempSocket.close();
        setSocket({});
      }
    };
  }, [userInfo.token]);

  useEffect(() => {
    // console.log("fetching user info ");
    dispatch(fetchUserInfo());
  }, []);

  // useEffect(() => {
  //   if (userInfo.token) dispatch(GeneralUpdate());
  //   return () => {
  //     // console.log("app unmounting");
  //     setSocket({});
  //   };
  // }, [userInfo.token]);

  useEffect(() => {
    if (currentChat) {
      if (userInfo.token) {
        // used for setting chat info just before sending a new message to create a new chat
        if (Object.keys(currentChat).find((key) => key === "newChatMembers")) {
          let members = [...currentChat.newChatMembers];
          dispatch(statusActions.setChatHistory({ members }));
          return;
        }

        fetch(http_url + "/chat_app/chat_update/" + currentChat, {
          headers: { authorization: "token " + userInfo.token },
        })
          .then((response) => {
            if (response.ok) return response.json();
            else {
              history.replace("/");
            }
          })
          .then((data) => dispatch(statusActions.setChatHistory(data)))
          .catch((error) => console.error(error));
      }
    } else dispatch(statusActions.setChatHistory(null));
  }, [currentChat, userInfo]);

  useEffect(() => {
    // let data;
    // console.log("socket is ", socket);
    if (socket.url) {
      // console.log(socket);

      socket.onopen = () => {
        console.log("connected to websocket");
      };

      socket.onmessage = (e) => {
        console.log("onmessage via websocket");
        const data = JSON.parse(e.data);
        console.log(data);

        // if (Object.keys(data).find((key) => key === "newChat")) {
        // }
        if (data.newChat && data.room) {
          dispatch(statusActions.addChat(data.room));
          console.log("new room added", data.room);
          if (data.sender === userInfo?.username)
            history.replace(`room/${data.room.id}`);
          // else console.log("the user is not the sender");
        } else if (data.message.room_id == currentChat && chatHistory) {
          dispatch(
            statusActions.setChatHistory({
              ...chatHistory,
              messages: [...chatHistory.messages, data.message],
            })
          );
          console.log("new message appended");
        }
      };
    }
    // return () => {
    //   console.log("resetting socket onopen and onmessage");
    //   socket.onopen = () => null;
    //   socket.onmessage = () => null;
    // };
  }, [socket, currentChat, chatHistory, chats, userInfo, dispatch, history]);

  function onClickFriend(user) {
    let chat_id = chats?.find(
      (chat) =>
        chat.members.length === 2 &&
        chat.members.find((member) => member === user)
    )?.id;

    if (chat_id) {
      history.push(`/room/${chat_id}`);
    } else {
      console.log("redirect", chat_id);
      history.push(`/newchat?section=send_message&members=${user}`);
      // history.replace({
      //   pathname: "/newchat",
      //   state: { user },
      // });
    }
  }

  if (userInfo.isLoading) {
    return <Spinner />;
  } else if (!userInfo.token) {
    return (
      <>
        <Route path="/login">
          <Login userInfo={null} />
        </Route>
        <Route path="/register">
          <Registration userInfo={null} />
        </Route>
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </>
    );
  }

  return (
    <>
      {/* <Spinner /> */}
      <Main mobileViewSide={"left"} onClickFriend={onClickFriend} />
      <Route exact path="/">
        {userInfo.token ? (
          <ChatWindow mobileViewSide={"left"} />
        ) : (
          // <div className="right empty HideIfMobile">
          //   There are no messages to display. Please select a chat to display
          //   messages.
          // </div>
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/room/:room_id">
        <ChatWindow
          // chatTitle={GetChatTitle(currentChat, chats, userInfo)}
          socket={socket}
          mobileViewSide={"right"}
        />
      </Route>
      <Route path="/newchat">
        <NewChat
          socket={socket}
          onClickFriend={onClickFriend}
          mobileViewSide={"right"}
        />
      </Route>
      <Route path="/addfriend">
        <AddFriend mobileViewSide={"right"} />
      </Route>
      <Route path="/login">
        <Login loggedIn={true} />
      </Route>
      <Route path="/register">
        <Registration loggedIn={true} />
      </Route>
    </>
  );
}
