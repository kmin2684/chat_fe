import React from "react";
import { useSelector} from "react-redux";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Friend from '../Friend/Friend';


export default function ChatWindowModal(prop) {
    const members = useSelector(state => state.status.chatHistory?.members);

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
    >

        <DialogTitle>members</DialogTitle>
        {members.map(member => <Friend key={member} friend={member} onClickFriend = {() => {return} }/>)}

    </Dialog>
    </>
    )
}
