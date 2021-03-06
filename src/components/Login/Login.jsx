import React, { useState} from "react";
import {SaveUserInfo} from "../../others/shared_functions";
import Spinner from '../Spinner/Spinner';
import { useDispatch } from "react-redux";
import {userInfoActions} from "../../store/userInfo-slice";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {
    Redirect,
    useHistory
  } from "react-router-dom";

import { http_url} from "../../others/shared_vars";

export default function Login({loggedIn}) {
    let history = useHistory();
    const dispatch = useDispatch(); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        fetch( http_url + '/chat_app/api-token-auth/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        .then(response => {
            setIsLoading(false);
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data?.token) {
                SaveUserInfo({username: data.username, token: data.token});
                dispatch(userInfoActions.setUserInfo({username: data.username, token: data.token}));
            } else if (data?.non_field_errors) {
                console.log('error message', data.non_field_errors);
                alert(data.non_field_errors);
            }
        });
    }
    
    function onChange(event, type) {
        if (type === "username")
            setUsername(event.target.value);
        else if (type === "password") 
            setPassword(event.target.value); 
    }

    function VisitorSignIn(type) {
        let username = undefined;
        let password = undefined;
        console.log(type); 
        if (type === 1) {
            username = 'visitor1';
            password = '123';
        } else if  (type === 2) {
            username = 'visitor2';
            password = '123';
        }
        setIsLoading(true);
        fetch( http_url + '/chat_app/api-token-auth/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setIsLoading(false);
            if (data.token) {
                SaveUserInfo({username: data.username, token: data.token});
                dispatch(userInfoActions.setUserInfo({username: data.username, token: data.token}));
            } else if (data.non_field_errors) {
                console.log('error message', data.non_field_errors);
                alert(data.non_field_errors);
            }
        });
    }

    return  (loggedIn? <Redirect to='/' /> 
    :
    <div className='login'>
        <form onSubmit={onSubmit} className='login-form'>
            <TextField id="outlined-basic" type="text" placeholder="id" autoComplete="username" onChange={(event)=>onChange(event, 'username')} value={username} />
            <TextField id="outlined-password-input" type="password" autoComplete="current-password"  placeholder="password" onChange={(event)=>onChange(event, 'password')} value={password} />
            <Button variant="contained" type="submit">log in</Button>
        </form>
        <div>do not have an account yet?</div>
        <div className='creat-new-account'><Button variant="contained" onClick={()=>history.push('/register')}>Create a New Account</Button></div>
        <div>want to try the app without registering?</div>
        <div className = 'visitor-sign-in'><Button variant="contained"  onClick={() => VisitorSignIn(1)}>sign in as visitor1</Button></div>
        <div className = 'visitor-sign-in'><Button variant="contained"  onClick={() => VisitorSignIn(2)}>sign in as visitor2</Button></div>
        {isLoading&&<Spinner />}
    </div>
    );

}

