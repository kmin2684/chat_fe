import React, { useState, useEffect, Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory
} from "react-router-dom";
import ChatWindow from "./ChatWindow";
import { MobileViewSide } from "../App";

export default function AddFriend ({chatHistory, myID, width, showChat, setChatHistoryProp, ChatPeopleSwitch, rooms, friends, setCurrentChatProp, userInfo}) {

    
    const [query, setQuery] = useState(undefined);
    const [suggestions, setSuggestions] = useState(undefined);
    const history = useHistory();

    useEffect(()=>{
        MobileViewSide('right');
    }, [])

    function onChange(e) {
        setQuery(e.target.value);
    }

    function onSubmit(e) {
        e.preventDefault();
        fetch('http://127.0.0.1:8000/chat_app/add_friend?' + new URLSearchParams({username: query}), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authorization': 'token '+ userInfo.token,},
        })
        .then(response => {
            if (response.ok) return response.json()
            else return null
        })
        .then(data => {
            console.log(data);
            setSuggestions(data);
            // if (data.token) {
            //     SaveUserInfo({username: data.username, token: data.token});
            //     SetUserInfoProp({username: data.username, token: data.token});
            // } else if (data.non_field_errors) {
            //     console.log('error message', data.non_field_errors);
            // }
        });
    }

    function onClick(e) {
        let username = e.target.value;
        let new_suggestion;
        fetch('http://127.0.0.1:8000/chat_app/add_friend', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': 'token '+ userInfo.token},
            body: JSON.stringify({username})
        })
        .then(response => {console.log(response.status, response.ok); if (response.ok)response.json()})
        .then(data => {
            console.log(data);
            new_suggestion = suggestions.map(suggestion => {
                if (suggestion.username === username) return {username, isFriend: true}
                return suggestion;
            })
            setSuggestions(new_suggestion);
            // if (data.token) {
            //     SaveUserInfo({username: data.username, token: data.token});
            //     SetUserInfoProp({username: data.username, token: data.token});
            // } else if (data.non_field_errors) {
            //     console.log('error message', data.non_field_errors);
            // }
        });
    } 
 

    const searchResult = <div className="right-row2>">
        {suggestions?.map(suggestion => <>
            <div>
                {suggestion.username}
                {suggestion.isFriend ? <span>added</span> 
                : <button onClick={e => onClick(e)} value={suggestion.username}> Add</button>}
            </div>
        </>
        )}
    </div>;

    return <>
    <div className="right">
        <div className="right-row1">
            <div><button onClick={() => history.push('/')}>Home</button></div>
            <form onSubmit={e => onSubmit(e)}>
                <input type="text" placeholder="search by username" value={query} onChange = {e=>onChange(e)}/>
            </form>
        </div>
        {searchResult}
    </div>
    </>;

}