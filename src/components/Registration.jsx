import React, { useState, useEffect } from "react";
import {useDispatch} from "react-redux";
import {SaveUserInfo} from "../others/shared_functions";
import Spinner from './Spinner';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    Redirect,
    useHistory
  } from "react-router-dom";

import { http_url, ws_url } from "../others/shared_vars";
import { userInfoActions } from "../store/userInfo-slice";

export default function Registration({userInfo, loggedIn, SetUserInfoProp}) {
    const history = useHistory();
    const dispatch = useDispatch();

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [password2, setPassword2] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    function onSubmit(event) {
        event.preventDefault();
        // let content = {id, pwd};]
        setIsLoading(true);
        fetch( http_url + '/chat_app/registration', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password, password2})
        })
        .then(response => {
            setIsLoading(false);
            return response.json();})
        .then(data => {
            console.log(data);
            let keys = Object.keys(data)
            if (keys.find(key => key === "token")) {
                SaveUserInfo({username: data.username, token: data.token});
                // SetUserInfoProp({username: data.username, token: data.token});
                dispatch(userInfoActions.setUserInfo({username: data.username, token: data.token}));
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
    <div className = "registration">
    {isLoading&&<Spinner/>}
        <form onSubmit={onSubmit}>
            <TextField id="outlined-basic" placeholder="id" onChange={(event)=>onChange(event, 'username')} value={username} />
            <TextField id="outlined-password-input" type="password" placeholder="password" onChange={(event)=>onChange(event, 'password')} value={password} />
            <TextField id="outlined-password-input" type="password" placeholder="retype password" onChange={(event)=>onChange(event, 'password2')} value={password2} />
            <Button variant="contained" type="submit">register</Button>
        </form> 
    <div>Already registered? <Button variant="contained" onClick={()=>history.push('/login')}>Go to sign in page</Button></div>  
    </div>
    
    </>;
}


