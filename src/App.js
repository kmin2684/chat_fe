import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ChatPeopleList from "./components/ChatPeopleList";
import ChatPeopleToggle from "./components/ChatPeopleToggle";
import Login from "./components/Login";
import NewChat from "./components/NewChat";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect,
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import Main from "./components/Main";
import { room1, room2, friend_list, room_list, userInfo2 } from "./test_vars";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

async function GetChat(id, token) {
  let response = await fetch(
    "http://127.0.0.1:8000/chat_app/chat_update/" + id,
    {
      headers: { authorization: "token " + token },
    }
  );
  let response_json = await response.json();
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
  // console.log("ShowIfMobile, originalClassList: ", originalClassList, ", uniqueClassList: ", uniqueClassList);

  // add className of "HideIfMobile" to the element that will be displayed
  let sideHidden = document.querySelector(`.${hide}`);
  originalClassList = sideHidden.classList.value
    .split(/(\s+)/)
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
    localStorage.ChatUserInfo = JSON.stringify(userInfo);
    console.log("user info save in local storage");
  } else {
    console.log("unable to use localStorage");
  }
}

export default function App() {
  // const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState("loading");
  const [chat, setChats] = useState(undefined);
  const [friends, setFriends] = useState(undefined);
  function SetUserInfoProp(data) {
    setUserInfo(data);
  }

  useEffect(() => {
    async function GetUserInfo() {
      if (typeof Storage !== "undefined") {
        if (localStorage.ChatUserInfo) {
          let storedInfo = JSON.parse(localStorage.ChatUserInfo);
          try {
            let response = await fetch(
              "http://127.0.0.1:8000/chat_app/user_check",
              {
                method: "GET",
                headers: { Authorization: "token " + storedInfo.token },
              }
            );
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
              // return <Redirect to='/newchat'/>
              // return {username: response_json.username, token: userInfo.token};
            }
          } catch (error) {
            localStorage.ChatUserInfo = null;
            console.error(error);
            // setUserInfo(null);
          }
          // if (storedInfo.token) {
          //   console.log('token in local storage');
          //   // check userInfo against server database
          //   if (storedInfo.token) {
          //     let response = await fetch('http://127.0.0.1:8000/chat_app/user_check', {
          //       method: 'GET',
          //       headers: {'Authorization': 'token '+ storedInfo.token},
          //     });
          //     let response_json = await response.json();
          //     if (response_json.username) {
          //       SaveUserInfo({username: response_json.username, token: storedInfo.token});
          //       setUserInfo({username: response_json.username, token: storedInfo.token});
          //       // return <Redirect to='/newchat'/>
          //       // return {username: response_json.username, token: userInfo.token};
          //     }
          //   } else console.log("localStorage.ChatUserInfo undefined")
          // } else {
          //   console.log('no token in local storage');
          //   setUserInfo(null);
          // }
        } else {
          console.log("localStorage.ChatUserInfo is undefined");
        }
      } else {
        console.log("storage undefined");
      }
      setUserInfo(null);
    }

    // console.log("getting user info");
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
        let response = await fetch(
          "http://127.0.0.1:8000/chat_app/general_update",
          {
            method: "GET",
            headers: { Authorization: "token " + userInfo.token },
          }
        );
        let response_json = await response.json();
        console.log("\n\n\n general update \n\n\n");
        console.log(response_json);
        // console.log("token used for general update:", userInfo);
      }
    }

    // console.log("general updating", userInfo, userInfo.token);
    GeneralUpdate();
  }, [userInfo]);

  const [myID, setMyID] = useState("1");

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

  // switching between chat and people list
  const [showChat, setShowChat] = useState(true);
  function ChatPeopleSwitch(state) {
    state ? setShowChat(true) : setShowChat(false);
  }

  // displaying chat history
  const [chatHistory, setChatHistory] = useState(null);
  function LoadChat(chat) {
    console.log("load " + chat);
    let current = [room1, room2].find((room) => room.id === chat);
    console.log("current is");
    console.log("current");
    setChatHistory(current);
    console.log("chat history: ", chatHistory);
  }

  // console.log("print userInfo:", userInfo);
  // console.log('is Loading2 :',isLoading);

  if (userInfo === "loading") {
    return null;
  } else if (!userInfo) {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/login">
              <Login userInfo={null} SetUserInfoProp={SetUserInfoProp} />
            </Route>
            <Route path="/">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {userInfo ? (
              <>
                <Main
                  width={width}
                  showChat={showChat}
                  LoadChat={LoadChat}
                  ChatPeopleSwitch={ChatPeopleSwitch}
                  rooms={room_list}
                  friends={friend_list}
                  mobileViewSide={"left"}
                />
                <ChatWindow
                  chatHistory={undefined}
                  LoadChat={LoadChat}
                  myID={myID}
                />
              </>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
          <Route path="/room/:room_id">
            <Main
              width={width}
              showChat={showChat}
              LoadChat={LoadChat}
              ChatPeopleSwitch={ChatPeopleSwitch}
              rooms={room_list}
              friends={friend_list}
              mobileViewSide={"right"}
            />
            <ChatWindow
              chatHistory={chatHistory}
              LoadChat={LoadChat}
              myID={myID}
            />
          </Route>
          <Route path="/newchat">
            <NewChat
              friends={friend_list}
              LoadChat={LoadChat}
              width={width}
              showChat={showChat}
              LoadChat={LoadChat}
              ChatPeopleSwitch={ChatPeopleSwitch}
              rooms={room_list}
              friends={friend_list}
            />
          </Route>
          <Route path="/login">
            <Login userInfo={null} loggedIn={true} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

// function LeftWindow ({width, showChat, LoadChat, ChatPeopleSwitch, rooms, friends}) {
//   return (
//     <div className = 'left'>
//       <div className='left-row1'>
//         <div className = "Header">
//           Header, width={width}
//           <button>
//             <Link to='/newchat'>
//             new chat
//             </Link>
//           </button>
//         </div>
//       </div>
//         <div className='left-row2'>
//           <ChatPeopleList showChat={showChat} LoadChat={LoadChat} rooms={rooms} friends={friends}/>
//         </div>
//         <div className='left-row3'>
//           <ChatPeopleToggle ChatPeopleSwitch={ChatPeopleSwitch}/>
//         </div>
//     </div>
//   );
// }
