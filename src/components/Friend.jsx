import React from "react";
import './Friend.css'

export default function Friend ({friend, onClickFriend}) {
    return <div onClick = {() => onClickFriend(friend)}>{friend}</div>
}