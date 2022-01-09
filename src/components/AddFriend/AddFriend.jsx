import React, { useState, useEffect} from "react";
import {
  useHistory
} from "react-router-dom";
import Friend from "../Friend/Friend";
import { MobileViewSide } from "../../others/shared_functions";
import { http_url} from "../../others/shared_vars";
import { useSelector, useDispatch } from "react-redux";
import { statusActions } from "../../store/status-slice";
import xIcon from "../../icons/x-lg.svg"
import  {TextField }  from '@mui/material';
import './AddFriend.scss'


export default function AddFriend () {

    const dispatch = useDispatch();

    dispatch(statusActions.setChatHistory(null));

    const [query, setQuery] = useState(undefined);
    const [suggestions, setSuggestions] = useState(undefined);
    const history = useHistory();
    const userInfo = useSelector(state => state.userInfo);

    useEffect(()=>{
        MobileViewSide('right');
    }, [])

    useEffect(()=>{
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
    ,[query, userInfo.token])

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
            dispatch(statusActions.addFriend(username));
        });
    } 
 
    const searchResult = <div className="right-row2>">
        {suggestions?.map(suggestion => <>
            <Friend 
            friend={suggestion.username}
            onClickFriend={()=>null}
            isFriend={suggestion.isFriend}
            addFriend={onClick}
            />
        </>
        )}
    </div>;

    return <>
    <div className="right add-friend">
        <div className="right-row1">
            <div className='iconContainer xIconContainer' onClick={()=>history.push('/')}> 
                <img src={xIcon} className='icon' alt='X'/>
            </div>
            <div >
                Add friends
            </div>
        </div>
        <div className='right-row2'>
            <form onSubmit={e => onSubmit(e)}>
                <div className='text-field-container'>
                    <TextField variant="standard" type='text' placeholder='search by username' required="required" value={query}  onChange = {e=>onChange(e)} />
                </div>
            </form>
        {searchResult}
        </div>
    </div>
    </>;

}