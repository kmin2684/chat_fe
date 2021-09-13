import React, { useState, useEffect } from "react";
// import './Chat.css;'
import {SaveUserInfo} from "../App";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    Redirect
  } from "react-router-dom";

export default function Login({userInfo, loggedIn, SetUserInfoProp}) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    
    function onSubmit(event) {
        event.preventDefault();
        // let content = {id, pwd};
        fetch('http://127.0.0.1:8000/chat_app/api-token-auth/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.token) {
                SaveUserInfo({username: data.username, token: data.token});
                SetUserInfoProp({username: data.username, token: data.token});
            } else if (data.non_field_errors) {
                console.log('error message', data.non_field_errors);
            }
        });
    }
    
    function onChange(event, type) {
        if (type === "username")
            setUsername(event.target.value);
        else if (type === "password") 
            setPassword(event.target.value); 
    }

    return  (loggedIn? <Redirect to='/' /> 
    :
    <form onSubmit={onSubmit}>
        <input type="text" placeholder="id" onChange={(event)=>onChange(event, 'username')} value={username} />
        <input type="password" placeholder="password" onChange={(event)=>onChange(event, 'password')} value={password} />
        <button type="submit">log in</button>
    </form>
    );
        // <form onSubmit={onSubmit}>
        //     <input type="text" placeholder="id" onChange={(event)=>onChange(event, 'username')} value={username} />
        //     <input type="password" placeholder="password" onChange={(event)=>onChange(event, 'password')} value={password} />
        //     <button type="submit">log in</button>
        // </form>
}



// onSubmit
//     prevent defualt action
//     send id and password via post method
//     if response is success
//         redirect to main page 
//     else display error message to the user 