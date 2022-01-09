import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import NewChat from "./components/NewChat/NewChat";
import AddFriend from "./components/AddFriend/AddFriend";
import Spinner from "./components/Spinner/Spinner";
import React, { useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import Main from "./components/Main/Main";
import { http_url, ws_url } from "./others/shared_vars";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo, GeneralUpdate } from "./store/userInfo-actions";
import { statusActions } from "./store/status-slice";

export default function App() {
  const history = useHistory();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userInfo);
  const chats = useSelector((state) => state.status.chats);
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
  }, [userInfo.token, dispatch]);

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (currentChat && userInfo.token) {
      // used for setting chat info just before sending a new message to create a new chat
      // if ("newChatMembers" in currentChat) {
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
    } else dispatch(statusActions.setChatHistory(null));
  }, [currentChat, userInfo, dispatch, history]);

  useEffect(() => {
    if (socket.url) {
      socket.onopen = () => {
        console.log("connected to websocket");
      };

      socket.onmessage = (e) => {
        console.log("onmessage via websocket");
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.newChat && data.room) {
          dispatch(statusActions.addChat(data.room));
          console.log("new room added", data.room);
          if (data.sender === userInfo?.username)
            history.replace(`room/${data.room.id}`);
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
    }
  }

  if (userInfo.isLoading) {
    return (
      <>
        <Spinner />
        <div>it may take up to 20 seconds to load the app...</div>
      </>
    );
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
        <ChatWindow socket={socket} mobileViewSide={"right"} />
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
