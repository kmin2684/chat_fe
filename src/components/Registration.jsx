import React, { useState, useEffect } from "react";
// import './Chat.css;'
import {SaveUserInfo} from "../App";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    Redirect,
    useHistory
  } from "react-router-dom";

export default function Registration({userInfo, loggedIn, SetUserInfoProp}) {
    let history = useHistory();
       
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);
    
    function onSubmit(event) {
        event.preventDefault();
        // let content = {id, pwd};
        fetch('http://127.0.0.1:8000/chat_app/registration', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password, password2})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let keys = Object.keys(data)
            if (keys.find(key => key === "token")) {
                SaveUserInfo({username: data.username, token: data.token});
                SetUserInfoProp({username: data.username, token: data.token});
            } else if (keys.find(key => key === "error")) {
                console.log('error message', data.error);
            }
        });
    }
    
    function onChange(event, type) {
        if (type === "username")
            setUsername(event.target.value);
        else if (type === "password") 
            setPassword(event.target.value); 
        else if (type == "password2")
            setPassword2(event.target.value); 
    }

    if (loggedIn) return <Redirect to='/' />

    return <>
     <form onSubmit={onSubmit}>
        <input type="text" placeholder="id" onChange={(event)=>onChange(event, 'username')} value={username} />
        <input type="password" placeholder="password" onChange={(event)=>onChange(event, 'password')} value={password} />
        <input type="password" placeholder="retype password" onChange={(event)=>onChange(event, 'password2')} value={password2} />
        <button type="submit">register</button>
    </form> 
    <div>Already registered? <button onClick={()=>history.push('/login')}>Go to sign in page</button></div>  
    </>;
}

