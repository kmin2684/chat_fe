import React from "react";
import './Friend.css'
import {StringToColor} from '../others/shared_functions"'

export default function Friend ({friend, onClickFriend}) {
    
    const style = {backgroundColor: StringToColor(friend)}; 
    
    return <>
        <div className='friend' onClick = {() => onClickFriend(friend)}>
            <div className='userIcon' style={style}>
                {friend[0]}
            </div>
            {friend}
        </div>
    </>
}

