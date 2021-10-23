import React, { useState, useEffect, useRef } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory,
  } from "react-router-dom";
import TimeAgo from 'timeago-react';
import xIcon from "../icons/x-lg.svg";
import infoIcon from "../icons/info.svg";
import { MobileViewSide } from "../others/shared_functions";
import { http_url, ws_url } from "../others/shared_vars";
import { useSelector, useDispatch } from "react-redux";
import {statusActions} from "../store/status-slice";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from "@material-ui/core/styles";
import Friend from './Friend';

const useStyles = makeStyles({
    topScrollPaper: {
      alignItems: "flex-start"
    }});

export default function ChatWindowModal(prop) {
    const members = useSelector(state => state.status.chatHistory?.members);

    const classes = useStyles(); 

    if (!members) {
        return null;
    }; 

    return ( <>    
    <Dialog
        open={prop.modalOpen}
        onClose={() => prop.setModalOpenProp(false)}
        container={() => document.querySelector('.chat-window')}
        style={{position: 'absolute'}}
        BackdropProps={{ style: { position: 'absolute' } }}
        componentsProps={{style: { padding: '100' }}}

        // classes={{
        //     scrollPaper: classes.topScrollPaper}}

        // aria-labelledby="modal-modal-title"
        // aria-describedby="modal-modal-description"
    >
        <DialogTitle>members</DialogTitle>
        
        {members.map(member => <Friend friend={member} onClickFriend = {() => {return} }/>)}

    </Dialog>
    </>
    )
}
