import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import ChatPeopleList from "./components/ChatPeopleList";
import ChatPeopleToggle from "./components/ChatPeopleToggle";
import Login from "./components/Login";
import NewChat from "./components/NewChat"
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import Main from "./components/Main"

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const room1 = {
  id: '1',
  members_id: ['1', '2'],
  messages: [
    {content:'message1', sender:'2', time:'1min ago'},
    {content:'message2', sender:'1', time:'now'},
  ],
};

const room2 = {
  id: '2',
  members_id: ['1', '3'],
  messages: [
    {content:'message3', sender:'1', time:'3min ago'},
    {content:'message4', sender:'2', time:'1min ago'},
  ],
};

const friend_list = [
  {id: '2', username: 'user2'},
  {id: '3', username: 'user3'},
  {id: '4', username: 'user4'},
];

const room_list = [
  {
    id: '1', 
    users_id: ['1', '2'], 
    last_message: {
      content:'message2', 
      sender:'me', 
      time:'now'
    }
  },
  {
    id: '2', 
    users_id: ['1', '3'], 
    last_message: {
      content:'message3', 
      sender:'joe', 
      time:'1min'
    }
  },
];

// const userInfo2 = {
//   isLoggedIn: true,
//   username: 'wwer',
//   token: 'sdpiofji',
// }




export function SaveUserInfo(userInfo) {
  if (typeof(Storage) !== "undefined") {
      localStorage.ChatUserInfo = JSON.stringify(userInfo);
      console.log('user info save in local storage'); 
  } else {
      console.log('unable to use localStorage')
  }
}

export default function App() {

  // const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState('loading');
  function SetUserInfoProp(data) {
    setUserInfo(data)
  }

  useEffect(() => {
    async function GetUserInfo() {
      if (typeof(Storage) !== "undefined") {
        if (localStorage.ChatUserInfo) {
          let storedInfo = JSON.parse(localStorage.ChatUserInfo);
          try {
            let response = await fetch('http://127.0.0.1:8000/chat_app/user_check', {
              method: 'GET',
              headers: {'Authorization': 'token '+ storedInfo.token},
            });
            let response_json = await response.json();
            if (response_json.username) {
              SaveUserInfo({username: response_json.username, token: storedInfo.token});
              setUserInfo({username: response_json.username, token: storedInfo.token});
              return;
              // return <Redirect to='/newchat'/>
              // return {username: response_json.username, token: userInfo.token};
            }
          } catch (error) {
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
        console.log('storage undefined');
      } 
      setUserInfo(null);
    }
    
    GetUserInfo(); 
    // setIsLoading(5);
    // console.log('is loading?: ', isLoading);
  }, [])

  const [myID, setMyID] = useState('1');

  // monitoring viewport width
  const [windowDimensions, setWindowDimensions] = useState({width: null});
  const {width} = windowDimensions; 

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []
  );

  // switching between chat and people list
  const [showChat, setShowChat] = useState(true);
  function ChatPeopleSwitch(state) {
    state? setShowChat(true) : setShowChat(false);
  }

  // displaying chat history
  const [chatHistory, setChatHistory] = useState(null);
  function LoadChat(chat) { 
    console.log('load '+chat);
    let current = [room1, room2].find(room => room.id === chat);
    console.log('current is');
    console.log('current');
    setChatHistory(current);
    console.log(chatHistory);
  }

  console.log('print userInfo:', userInfo);
  // console.log('is Loading2 :',isLoading);

  if (userInfo === 'loading') {
    return null
  } else if (!userInfo) {
    return (
      <div className = 'App'>
        <Router>
          <Switch>
            <Route path='/login'>
              <Login userInfo = {null} SetUserInfoProp = {SetUserInfoProp} />
            </Route>
            <Route path='/'>
              <Redirect to='/login' />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

  return (
    <div className = 'App'> 
      <Router>
        <Switch> 
          <Route exact path="/">
            {userInfo? <>
              <Main 
              width = {width} 
              showChat = {showChat} 
              LoadChat = {LoadChat} 
              ChatPeopleSwitch = {ChatPeopleSwitch}
              rooms = {room_list}
              friends = {friend_list}
              />
              <ChatWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID}/>
            </> : 
            <Redirect to='/login' />
            }
              {/* <Main 
              width = {width} 
              showChat = {showChat} 
              LoadChat = {LoadChat} 
              ChatPeopleSwitch = {ChatPeopleSwitch}
              rooms = {room_list}
              friends = {friend_list}
              />
              <ChatWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID}/> */}
          </Route>
          <Route path="/room/:room_id">
            <Main 
            width = {width} 
            showChat = {showChat} 
            LoadChat = {LoadChat} 
            ChatPeopleSwitch = {ChatPeopleSwitch}
            rooms = {room_list}
            friends = {friend_list}
            />
            <ChatWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID}/>
          </Route>
          <Route path='/newchat'>
            <NewChat 
            friends={friend_list} 
            LoadChat={LoadChat} 
            width = {width} 
            showChat = {showChat} 
            LoadChat = {LoadChat} 
            ChatPeopleSwitch = {ChatPeopleSwitch}
            rooms = {room_list}
            friends = {friend_list}/>
          </Route>
          <Route path='/login'>
            <Login userInfo = {null} loggedIn = {true}/>
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
