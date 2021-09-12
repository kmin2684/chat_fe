import React, { useState, useEffect } from "react";
// import './Chat.css;'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

export default function Login({userInfo}) {
    const [id, setId] = useState(null);
    const [pwd, setPwd] = useState(null);
    
    function onSubmit(event) {
        event.preventDefault();
    }
    
    function onChange(event, type) {
        if (type === "id")
            setId(event.target.value);
        else if (type === "pwd") 
            setPwd(event.target.value); 
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" placeholder="id" onChange={(event)=>onChange(event, 'id')} value={id} />
            <input type="password" placeholder="password" onChange={(event)=>onChange(event, 'pwd')} value={pwd} />
            <button type="submit">log in</button>
        </form>
    );
}



// onSubmit
//     prevent defualt action
//     send id and password via post method
//     if response is success
//         redirect to main page 
//     else display error message to the user 