import React, { useState, useEffect, useRef } from "react";


import { useSelector, useDispatch } from "react-redux";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from "@material-ui/core/styles";
import Friend from '../Friend/Friend';

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
        
        {members.map(member => <Friend key={member} friend={member} onClickFriend = {() => {return} }/>)}

    </Dialog>
    </>
    )
}
