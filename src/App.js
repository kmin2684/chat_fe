import "./App.css";
import ChatPeopleList from "./components/ChatPeopleList.jsx";
import ChatPeopleToggle from "./components/ChatPeopleToggle.jsx";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";

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



export default function App() {
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


  return (
    <div className = 'App'> 
      <Router>
        <Switch> 
          <Route exact path="/">
            <LeftWindow 
            width = {width} 
            showChat = {showChat} 
            LoadChat = {LoadChat} 
            ChatPeopleSwitch = {ChatPeopleSwitch}
            rooms = {room_list}
            friends = {friend_list}
            />
            <RightWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID}/>
          </Route>
          <Route path="/room/:room_id">
            <LeftWindow 
            width = {width} 
            showChat = {showChat} 
            LoadChat = {LoadChat} 
            ChatPeopleSwitch = {ChatPeopleSwitch}
            rooms = {room_list}
            friends = {friend_list}
            />
            <RightWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID}/>
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
            {/* if new chat does not exist */}
            {/* <RightWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID}/> */}
          </Route>
        </Switch> 
      </Router>
    </div>
  );
}

function LeftWindow ({width, showChat, LoadChat, ChatPeopleSwitch, rooms, friends}) {
  return (
    <div className = 'left'>
      <div className='left-row1'>
        <div className = "Header">
          Header, width={width}
          <button>
            <Link to='/newchat'>
            new chat
            </Link>
          </button>
        </div>
      </div>
        <div className='left-row2'>
          <ChatPeopleList showChat={showChat} LoadChat={LoadChat} rooms={rooms} friends={friends}/> 
        </div>
        <div className='left-row3'>
          <ChatPeopleToggle ChatPeopleSwitch={ChatPeopleSwitch}/>
        </div>
    </div>
  );
}

function RightWindow ({chatHistory, LoadChat, myID, inputOn}) {
  let { room_id } = useParams();
  room_id? LoadChat(room_id) : LoadChat(null);
  return (
    <div className='right'>
      {/* <div className='right-row1'>
        {room_id}
      </div>
      <div className='right-row2'>
        <ChatWindow chatHistory={chatHistory} myID={myID} room_id={room_id}/>
      </div>
      {chatHistory&&(
        <div className='right-row3'>
          <form>
            <input type='text' placeholder='Aa'/>
          </form>
        </div>
        )} */}
      <ChatWindow chatHistory={chatHistory} myID={myID} room_id={room_id} inputOn={inputOn}/>
    </div>
  );
}

function NewChat ({chatHistory, myID, width, showChat, LoadChat, ChatPeopleSwitch, rooms, friends}) {
  const [section, setSection] = useState('new_message');
  const [groupName, setGroupName] = useState(null);
  const [inputOn, setInputOn] = useState(null);
  function SwitchInputOn(value) {
    setInputOn(value);
  }

  function Change_section (current) {
    if (current === 'new_message') {
      setSection(new_message);
      setInputOn(false);
    } else if (current === 'add_participants') {
      setSection(add_participants);
      setInputOn(false);
    } else if (current === 'add_title') {
      setSection(add_title);
      setInputOn(false);
    } else if (current === 'send_message') {
      setInputOn(true); 
    }
  }

  const [checkedUsers, setCheckedUsers] = useState([]);
  function ChangeCheck(id) {
    // let checkedUsersCopy = [...checkedUsers];
    if (checkedUsers.find(user => user == id)) {
      console.log(id, 'unchecking')
      setCheckedUsers(checkedUsers.filter(user => user !== id));
    } else {
      console.log(id, 'checking')
      setCheckedUsers(checkedUsers.concat([id]));
    }
  }
  
  const new_message = (
    <div className='NewChat left'>
      <div className='left-row1'>
        <div>
          New message
        </div>
        <div>
          <button onClick={() => setSection('add_participants')}> Create a New Group </button>
        </div>
      </div>
      <div className='left-row2'>
        <div>
          Suggested:
        </div>
        {friends.map(friend => { return (
          <div>
            friend {friend.id}
          </div>
        );})}

      </div>
    </div>
  );

  const add_participants = (
    <div className='AddParticipants left'>
      <div className='left-row1'>
        <button onClick={() => setSection('new_message')}>
          back
        </button>
          Add Participants
        <button onClick={()=>setSection('add_title')}>
          NEXT
        </button>
      </div>
      <div className='left-row2'>
        {friends.map(friend => {
          const label = 'friend' + friend.id;
          return (
            <Checkbox label={label} value={checkedUsers.find(user => user === friend.id)} changeCheck={() => ChangeCheck(friend.id)} />
          );})}
      </div>
    </div>
  )

  const add_title = (
    <div className = 'AddTitle left'>
      <div className='left-row1'>
        <button onClick={()=>setSection('add_participants')}>back</button>
        Add Title
        <button onClick={()=>{setSection('send_message'); setInputOn(true)}}> CREATE</button>
      </div>
      <div className='left-row2'>
        <input type='text' placeholder='Group Name (Required)'></input>
      </div>
    </div>
  );
  
  // let page = null; 

  // if (section === 'new_message') {
  //   page = new_message;
  // } else if (section === 'add_participants') {
  //   page = add_participants;
  // } else if (section === 'add_title') {
  //   page = add_title;
  // }
  
  const page = section === 'new_message'? new_message
  : section === 'add_participants'? add_participants
  : section === 'add_title'? add_title
  : section === 'send_message'? 
    <LeftWindow 
    width = {width} 
    showChat = {showChat} 
    LoadChat = {LoadChat} 
    ChatPeopleSwitch = {ChatPeopleSwitch}
    rooms = {rooms}
    friends = {friend_list}
    />
  : null; 

  return [page, <RightWindow chatHistory = {chatHistory} LoadChat={LoadChat} myID={myID} inputOn={inputOn}/>]; 
  // if (section === 'new_message') {
  //   return new_message;
  // } else if (section === 'add_participants') {
  //   return add_participants;
  // } else if (section === 'add_title') {
  //   return add_title;
  // }
  
  
  // return section;

  // return (
  //   <div className='AddParticipants left'>
  //     <div className='left-row1'>
  //       <button onClick={() => setSection(new_message)}>
  //         back
  //       </button>
  //         Add Participants
  //       <button onClick={()=>setSection(add_title)}>
  //         NEXT
  //       </button>
  //     </div>
  //     <div className='left-row2'>
  //       {friends.map(friend => {
  //         const label = 'friend' + friend.id;
  //         return (
  //           // <Checkbox label={label} value={checkedUsers.find(user => user === friend.id)} changeCheck={() => ChangeCheck(friend.id)} />
  //           <Checkbox label={label} value={checkedUsers.find(user => user === friend.id)} changeCheck={() => ChangeCheck(friend.id)} />
  //           // <Checkbox label={label} value={false} changeCheck={() => ChangeCheck(friend.id)} />
  //         );})}
  //     </div>
  //   </div>
  // );



  // return (
  //   <div className='AddParticipants left'>
  //     <div className='left-row1'>
  //       <button>
  //         back
  //       </button>
  //         Add Participants
  //       <button>
  //         NEXT
  //       </button>
  //     </div>
  //     <div className='left-row2'>
  //       {friends.map(friend => {
  //         const label = 'friend' + friend.id;
  //         return (
  //           // <Checkbox label={label} value={checkedUsers.find(user => user === friend.id)} changeCheck={() => ChangeCheck(friend.id)} />
  //           <Checkbox label={label} value={checkedUsers.find(user => user === friend.id)} changeCheck={() => ChangeCheck(friend.id)} />
  //           // <Checkbox label={label} value={false} changeCheck={() => ChangeCheck(friend.id)} />
  //         );})}
  //     </div>
  //   </div>
  // ); 
}

function Checkbox ({label, value, changeCheck}) {
  return (
    <div className='group-participant'>
      <label>
        {label}
        <input type='checkbox' checked={value} onChange={changeCheck} ></input>
      </label>
    </div> 
    );
  }
