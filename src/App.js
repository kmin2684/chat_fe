import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ChatPeopleList from "./components/ChatPeopleList";
import ChatPeopleToggle from "./components/ChatPeopleToggle";
import Login from "./components/Login";
import Registration from "./components/Registration";
import NewChat3 from "./components/NewChat3";
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
import { room1, room2, friend_list, room_list, userInfo2 } from "./test_vars";
import { http_url, ws_url } from "./vars";
import { w3cwebsocket as W3CWebSocket } from "websocket";

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

export function StringToColor(string) {
  let colorMap = {
    0: "#313E50",
    1: "#924C5D",
    2: "#C5867A",
    3: "#E1915E",
    4: "#E17F5E",
    5: "#85A47A",
  };

  let sum = 0;
  for (let char of string) {
    sum += char.charCodeAt(0);
  }

  return colorMap[sum % 6];
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

async function GetChat(id, token) {
  let response = await fetch(http_url + "/chat_app/chat_update/" + id, {
    headers: { authorization: "token " + token },
  });
  let response_json = await response.json();
  return response_json;
}

export function MobileViewSide(viewSide) {
  let show;
  let hide;
  if (viewSide === "left") {
    show = "left";
    hide = "right";
  } else if (viewSide === "right") {
    show = "right";
    hide = "left";
  } else {
    console.log("invalide viewSide for MobileViewSide function");
    return;
  }
  // add className of "ShowIfMobile" to the element that will be displayed
  let sideDisplayed = document.querySelector(`.${show}`);
  let originalClassList = sideDisplayed.classList.value
    .split(/(\s+)/)
    .filter(function (e) {
      return e.trim().length > 0;
    });
  let uniqueClassList = [...new Set(originalClassList)];
  let modifiedClassList = uniqueClassList.filter(
    (e) => !(e === "HideIfMobile" || e === "ShowIfMobile")
  );
  sideDisplayed.classList.remove(...originalClassList);
  sideDisplayed.classList.add(...[...modifiedClassList, "ShowIfMobile"]);

  // add className of "HideIfMobile" to the element that will be displayed
  let sideHidden = document.querySelector(`.${hide}`);
  if (!sideHidden) {
    console.log("no side to hide");
    return;
  }
  console.log("side hidden", sideHidden);
  originalClassList = sideHidden?.classList?.value
    ?.split(/(\s+)/)
    .filter(function (e) {
      return e.trim().length > 0;
    });
  uniqueClassList = [...new Set(originalClassList)];
  modifiedClassList = uniqueClassList.filter(
    (e) => !(e === "HideIfMobile" || e === "ShowIfMobile")
  );
  sideHidden.classList.remove(...originalClassList);
  sideHidden.classList.add(...[...modifiedClassList, "HideIfMobile"]);
  return;
}

export function SaveUserInfo(userInfo) {
  if (typeof Storage !== "undefined") {
    if (!userInfo) localStorage.ChatUserInfo = null;
    else localStorage.ChatUserInfo = JSON.stringify(userInfo);
    console.log("user info saved in local storage");
  } else {
    console.log("unable to use localStorage");
  }
}

export default function App() {
  const history = useHistory();
  // const [isLoading, setIsLoading] = useState(true);
  const [myID, setMyID] = useState("1");
  const [userInfo, setUserInfo] = useState("loading");
  const [chats, setChats] = useState(undefined);
  const [friends, setFriends] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [socket, setSocket] = useState(undefined);

  // switching between chat and friend list
  const [showChat, setShowChat] = useState(true);

  // displaying chat history
  const [chatHistory, setChatHistory] = useState(undefined);

  function setUserInfoProp(data) {
    setUserInfo(data);
  }

  function SetFriendsProp(data) {
    setFriends(data);
  }

  function SetUserInfoProp(data) {
    setUserInfo(data);
  }

  function SetChatHistoryProp(data) {
    setChatHistory(data);
  }

  useEffect(() => {
    if (userInfo && typeof userInfo === "object") {
      console.log("typeof userInfo", typeof userInfo);
      if (Object.keys(userInfo).find((key) => key === "token")) {
        setSocket(
          new W3CWebSocket(ws_url + "/ws/chat/?token=" + userInfo.token)
        );
      }
    }
  }, [userInfo]);

  useEffect(() => {
    async function GetUserInfo() {
      if (typeof Storage !== "undefined") {
        if (localStorage.ChatUserInfo) {
          try {
            let storedInfo = JSON.parse(localStorage.ChatUserInfo);
            console.log("storedInfo: ", storedInfo);
            let response = await fetch(http_url + "/chat_app/user_check", {
              method: "GET",
              headers: { Authorization: "token " + storedInfo.token },
            });
            let response_json = await response.json();
            if (response_json.username) {
              SaveUserInfo({
                username: response_json.username,
                token: storedInfo.token,
              });
              setUserInfo({
                username: response_json.username,
                token: storedInfo.token,
              });
              return;
            }
          } catch (error) {
            localStorage.ChatUserInfo = null;
            console.error(error);
          }
        } else {
          console.log("localStorage.ChatUserInfo is undefined");
          setUserInfo(null);
        }
      } else {
        console.log("storage undefined");
      }
      setUserInfo(null);
    }

    GetUserInfo();
  }, []);

  useEffect(() => {
    async function GeneralUpdate() {
      // console.log("token is", userInfo.token);
      let token;
      if (userInfo) token = Object.keys(userInfo)?.find((e) => e === "token");
      else token = null;
      // console.log("token: ", token);
      if (token) {
        let response = await fetch(http_url + "/chat_app/general_update", {
          method: "GET",
          headers: { Authorization: "token " + userInfo.token },
        });
        let data = await response.json();
        console.log("\n\n\n general update \n\n\n");
        console.log(data);
        setChats(data.rooms);
        console.log("friends: ", data.friends, "chats: ", data.rooms);

        setFriends(data.friends);
        // console.log("token used for general update:", userInfo);
      }
    }

    // console.log("general updating", userInfo, userInfo.token);
    GeneralUpdate();
  }, [userInfo]);

  // monitoring viewport width
  const [windowDimensions, setWindowDimensions] = useState({ width: null });
  const { width } = windowDimensions;
  // useEffect(() => {
  //   function handleResize() {
  //     setWindowDimensions(getWindowDimensions());
  //   }
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []
  // );

  function ChatPeopleSwitch(state) {
    state ? setShowChat(true) : setShowChat(false);
  }

  function setCurrentChatProp(current) {
    setCurrentChat(current);
  }

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

  function GetChatTitle() {
    let displayedChat;
    if (!currentChat) return undefined;
    displayedChat = chats?.find((chat) => chat.id == currentChat);

    if (displayedChat?.name) return displayedChat.name;
    else {
      return displayedChat?.members?.find(
        (member) => member !== userInfo.username
      );
    }
  }

  useEffect(() => {
    let current;
    if (currentChat && userInfo) {
      if (Object.keys(userInfo).find((e) => e === "token")) {
        fetch(http_url + "/chat_app/chat_update/" + currentChat, {
          headers: { authorization: "token " + userInfo.token },
        })
          .then((response) => response.json())
          .then((data) => setChatHistory(data));
      }
    } else setChatHistory(undefined);
  }, [currentChat, userInfo]);

  useEffect(() => {
    let data;
    if (socket && typeof socket === "object") {
      console.log(socket);

      socket.onopen = () => {
        console.log("connected to websocket");
      };

      socket.onmessage = (e) => {
        console.log("onmessage via websocket");
        data = JSON.parse(e.data);
        console.log(data);

        if (Object.keys(data).find((key) => key === "newChat")) {
          if (data.newChat && data.room) {
            console.log("chats", chats);
            setChats([...chats, data.room]);
            if (data.sender === userInfo.username)
              history.push(`room/${data.room.id}`);
          }
        } else if (data.message.room_id == currentChat && chatHistory)
          setChatHistory({
            ...chatHistory,
            messages: [...chatHistory.messages, data.message],
          });
      };
    }
  }, [socket, currentChat, chatHistory, chats]);

  if (userInfo === "loading") {
    return null;
  } else if (!userInfo) {
    return (
      <>
        <Route path="/login">
          <Login userInfo={null} SetUserInfoProp={SetUserInfoProp} />
        </Route>
        <Route path="/register">
          <Registration userInfo={null} SetUserInfoProp={SetUserInfoProp} />
        </Route>
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </>
    );
  }

  return (
    <>
      <Main
        width={width}
        showChat={showChat}
        setChatHistoryProp={undefined}
        ChatPeopleSwitch={ChatPeopleSwitch}
        rooms={room_list}
        friends={friends}
        mobileViewSide={"left"}
        chats={chats}
        userInfo={userInfo}
        setUserInfoProp={setUserInfoProp}
        onClickFriend={onClickFriend}
      />
      <Route exact path="/">
        {userInfo ? (
          <>
            {/* <Main
              width={width}
              showChat={showChat}
              setChatHistoryProp={undefined}
              ChatPeopleSwitch={ChatPeopleSwitch}
              rooms={room_list}
              friends={friends}
              mobileViewSide={"left"}
              chats={chats}
              userInfo={userInfo}
              setUserInfoProp={setUserInfoProp}
              onClickFriend={onClickFriend}
            /> */}
            <ChatWindow
              chatHistory={undefined}
              // setChatHistoryProp={setChatHistoryProp}
              myID={myID}
              userInfo={userInfo}
              setCurrentChatProp={setCurrentChatProp}
              mobileViewSide={"left"}
            />
          </>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>
      <Route path="/room/:room_id">
        {/* <Main
          width={width}
          showChat={showChat}
          setChatHistoryProp={undefined}
          ChatPeopleSwitch={ChatPeopleSwitch}
          rooms={room_list}
          friends={friends}
          mobileViewSide={"right"}
          chats={chats}
          userInfo={userInfo}
          setUserInfoProp={setUserInfoProp}
          onClickFriend={onClickFriend}
        /> */}
        <ChatWindow
          chatHistory={chatHistory}
          chatTitle={GetChatTitle()}
          setChatHistoryProp={undefined}
          setCurrentChatProp={setCurrentChatProp}
          myID={myID}
          userInfo={userInfo}
          socket={socket}
          mobileViewSide={"right"}
        />
      </Route>
      <Route path="/newchat">
        {/* <Main
          width={width}
          showChat={showChat}
          setChatHistoryProp={undefined}
          ChatPeopleSwitch={ChatPeopleSwitch}
          rooms={room_list}
          friends={friends}
          mobileViewSide={"right"}
          chats={chats}
          userInfo={userInfo}
          setUserInfoProp={setUserInfoProp}
          onClickFriend={onClickFriend}
        /> */}
        <NewChat
          // friends={friend_list}
          // setChatHistoryProp={setChatHistoryProp}
          width={width}
          showChat={showChat}
          ChatPeopleSwitch={ChatPeopleSwitch}
          rooms={room_list}
          friends={friends}
          setCurrentChatProp={setCurrentChatProp}
          socket={socket}
          onClickFriend={onClickFriend}
          SetChatHistoryProp={SetChatHistoryProp}
          mobileViewSide={"right"}
        />
      </Route>
      <Route path="/newchat2">
        <NewChat3
          // friends={friend_list}
          // setChatHistoryProp={setChatHistoryProp}
          width={width}
          showChat={showChat}
          ChatPeopleSwitch={ChatPeopleSwitch}
          rooms={room_list}
          friends={friends}
          setCurrentChatProp={setCurrentChatProp}
        />
      </Route>
      <Route path="/addfriend">
        {/* <Main
          width={width}
          showChat={showChat}
          setChatHistoryProp={undefined}
          ChatPeopleSwitch={ChatPeopleSwitch}
          rooms={room_list}
          friends={friends}
          mobileViewSide={"right"}
          chats={chats}
          userInfo={userInfo}
          setUserInfoProp={setUserInfoProp}
          onClickFriend={onClickFriend}
        /> */}
        <AddFriend
          userInfo={userInfo}
          friends={friends}
          SetFriendsProp={SetFriendsProp}
          SetChatHistoryProp={SetChatHistoryProp}
          mobileViewSide={"right"}
        />
      </Route>
      <Route path="/login">
        <Login userInfo={null} loggedIn={true} />
      </Route>
      <Route path="/register">
        <Registration userInfo={null} loggedIn={true} />
      </Route>
    </>
  );
}
