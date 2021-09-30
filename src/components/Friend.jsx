import React from "react";
import './Friend.css'

export default function Friend ({friend, onClickFriend}) {
    return <>
        <div className='friend' onClick = {() => onClickFriend(friend)}>
            {friend}
        </div>
    </>
}