import '../App.css';
import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg';
import { 
    Avatar,
    List, 
    ListItem, 
    ListItemAvatar,
    ListItemText, 
    ListItemSecondaryAction,
    IconButton,
    Button
} from '@material-ui/core'
import {Delete} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
  }));

export default function CartPanel(){
    const classes = useStyles();

    const cartRef = FirebaseClient.store.collection('carts');
    const { uid, displayName } = FirebaseClient.auth.currentUser;
    const query = cartRef.where('userId', '==', uid );
    const [ cartItems ] = useCollectionData(query, {idField: "id"});

    return (
        <div>
            {`${displayName}'s Cart`}
            <div className={`${classes.demo} cart-list`}>
                <List dense={true}>
                    {
                        cartItems && cartItems.map(
                            (item, index) => {
                                return <CartItem album={item} key={index}/>
                            }
                        )
                    }
                </List>
                <Button size="large">
                    Checkout
                </Button>
            </div>
        </div>
    )
}

function CartItem(props){
    const { album } = props;
    console.log("DISPLAY CART ITEM: ", album);
    return (
        <ListItem className="cart-item" alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={`album cover`} src={albumPlaceholder}/>
            </ListItemAvatar>
            <ListItemText
                primary={album.albumId}
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="Delete">
                    <Delete/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>  
    )
}