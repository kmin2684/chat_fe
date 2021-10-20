import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login";
import Registration from "./components/Registration";
import NewChat from "./components/NewChat";
import AddFriend from "./components/AddFriend";
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
import ChatWindow from "./components/ChatWindow";
import Main from "./components/Main";
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

  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    if (userInfo.token) {
      setSocket(new W3CWebSocket(ws_url + "/ws/chat/?token=" + userInfo.token));
    }
  }, [userInfo.token]);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  useEffect(() => {
    if (userInfo.token) dispatch(GeneralUpdate());
  }, [userInfo.token]);

  useEffect(() => {
    if (currentChat) {
      if (userInfo.token) {
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
    let data;
    if (socket) {
      console.log(socket);

      socket.onopen = () => {
        console.log("connected to websocket");
      };

      socket.onmessage = (e) => {
        console.log("onmessage via websocket");
        data = JSON.parse(e.data);
        console.log(data);

        // if (Object.keys(data).find((key) => key === "newChat")) {
        // }
        if (data.newChat && data.room) {
          dispatch(statusActions.addChat(data.room));
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
        }
      };
    }
  }, [socket, currentChat, chatHistory, chats, userInfo]);

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
      history.replace({
        pathname: "/newchat",
        state: { user },
      });
    }
  }

  if (userInfo.isLoading) {
    return null;
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
      <Main mobileViewSide={"left"} onClickFriend={onClickFriend} />
      <Route exact path="/">
        {userInfo.token ? (
          <ChatWindow mobileViewSide={"left"} />
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/room/:room_id">
        <ChatWindow
          chatTitle={GetChatTitle(currentChat, chats, userInfo)}
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
