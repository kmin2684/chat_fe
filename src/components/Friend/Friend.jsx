import React from "react";
import './Friend.scss';
import {StringToColor} from '../../others/shared_functions';
import { Button } from "@mui/material";

export default function Friend ({friend, onClickFriend, checked, changeCheck, isFriend, addFriend}) {
    
    const style = {backgroundColor: StringToColor(friend)}; 
    
    if (changeCheck || addFriend) {
        return <>
        <div className='friend additional-field' onClick = {() => onClickFriend(friend)}>
            <div>
                <div className='userIcon' style={style}>
                    {friend[0]}
                </div>
                {friend}
            </div>
            {changeCheck&& <input type='checkbox' checked={checked} onChange={changeCheck} />}
            {addFriend&& 
                <Button 
                    value={friend} 
                    disabled={isFriend} 
                    onClick={e=>addFriend(e)}
                >
                 {isFriend? 'added': 'add'} 
                 </Button>}
        </div>
    </>    
    }
    
    return <>
        <div className='friend' onClick = {() => onClickFriend(friend)}>
            <div className='userIcon' style={style}>
                {friend[0]}
            </div>
            {friend}
        </div>
    </>    
}

