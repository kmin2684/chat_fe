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
import { MobileViewSide } from "../others/shared_functions";
import { http_url, ws_url } from "../others/shared_vars";
import { useSelector, useDispatch } from "react-redux";
import { statusActions } from "../store/status-slice";

export default function AddFriend () {
    const dispatch = useDispatch();


    dispatch(statusActions.setChatHistory(null));
    const [query, setQuery] = useState(undefined);
    const [suggestions, setSuggestions] = useState(undefined);
    const history = useHistory();
    const userInfo = useSelector(state => state.userInfo);
    const friends = useSelector(state => state.friends);


    useEffect(()=>{
        MobileViewSide('right');
    }, [])

    function onChange(e) {
        setQuery(e.target.value);
    }

    function onSubmit(e) {
        e.preventDefault();
        fetch( http_url + '/chat_app/add_friend?' + new URLSearchParams({username: query}), {
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
        });
    }

    function onClick(e) {
        let username = e.target.value;
        let new_suggestion;
        fetch( http_url + '/chat_app/add_friend', {
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
            // SetFriendsProp([...friends, username]); 
            dispatch(statusActions.addFriend(username));
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
            <div>
                <button onClick={() => history.push('/')}>Home</button>
                Add friends
            </div>
            <form onSubmit={e => onSubmit(e)}>
                <input type="text" placeholder="search by username" value={query} onChange = {e=>onChange(e)}/>
            </form>
        </div>
        {searchResult}
    </div>
    </>;

}