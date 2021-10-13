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

import { http_url, ws_url } from "../vars";

export default function Login({userInfo, loggedIn, SetUserInfoProp}) {
    let history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const spinner =  <>
        <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </>

    
    function onSubmit(event) {
        event.preventDefault();
        // let content = {id, pwd};
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
                SetUserInfoProp({username: data.username, token: data.token});
            } else if (data?.non_field_errors) {
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

    function VisitorSignIn(type) {
        let username = undefined;
        let password = undefined;
        if (type=1) {
            username = 'visitor1';
            password = '123';
        } else if  (type = 2) {
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
                SetUserInfoProp({username: data.username, token: data.token});
            } else if (data.non_field_errors) {
                console.log('error message', data.non_field_errors);
            }
        });
    }

    return  (loggedIn? <Redirect to='/' /> 
    :
    <div className='login'>
        <form onSubmit={onSubmit} className='login-form'>
            <input type="text" placeholder="id" onChange={(event)=>onChange(event, 'username')} value={username} />
            <input type="password" placeholder="password" onChange={(event)=>onChange(event, 'password')} value={password} />
            <button type="submit">log in</button>
        </form>
        <div>do not have an account yet?</div>
        <div className='creat-new-account'><button onClick={()=>history.push('/register')}>Create a New Account</button></div>
        <div>want to try the app without registering?</div>
        <div className = 'visitor-sign-in'><button  onClick={() => VisitorSignIn(1)}>sign in as visitor1</button></div>
        <div className = 'visitor-sign-in'><button  onClick={() => VisitorSignIn(2)}>sign in as visitor2</button></div>
        {isLoading&&spinner}
    </div>
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