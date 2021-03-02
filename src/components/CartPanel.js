import '../App.css';
import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg';
import MuiAlert from '@material-ui/lab/Alert'
import { 
    Avatar,
    List, 
    ListItem, 
    ListItemAvatar,
    ListItemText, 
    ListItemSecondaryAction,
    IconButton,
    Button,
    Snackbar,
    Typography
} from '@material-ui/core'
import {Delete} from '@material-ui/icons';
import moment from 'moment';
const useStyles = makeStyles((theme) => ({
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
  }));

const getTotalAmountToBePaid = (cartItems) => {
    let value = 0;
    cartItems.forEach(
        item => {
            value = item.album.price + value}
    )
    return `PHP ${value}.00`
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function CartPanel(){
    const classes = useStyles();
    const purchasesRef = FirebaseClient.store.collection('purchases');
    const albumsRef = FirebaseClient.store.collection('albums')
    const { uid, displayName } = FirebaseClient.auth.currentUser;
    const cartsRef = FirebaseClient.store.collection('carts')
    const cartQuery = cartsRef.where('userId', '==', uid).where('isDeleted', '==', false);
    const [cartItems] = useCollectionData( cartQuery, {idField: 'id'})
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    // const forPurchase = cartItems && cartItems.filter(item => !item.isDeleted);
    console.log("CART ITEMS: ", cartItems);
    const handleCheckoutClick = async() => {

        let addPurchase = purchasesRef.add({
            refNo: `A_${moment().format('MMDDYYYYHHMM')}`,
            userId: uid,
            timestamp: moment().format("MM/DD/YYYY HH:MM"),
            albums: cartItems
        })

        await addPurchase
                .then((checkoutRef) => {
                    //updates the buy count for each album
                    let albumIds = cartItems.map(
                        cartItem => { console.log("cart item", cartItem); return cartItem && cartItem.album.uid}
                    );
                    albumsRef.where('uid', 'in', albumIds).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((item) => 
                            {console.log("ITEM: ", item);
                                albumsRef.doc(item.id).update({
                                    buyCount: item.data().buyCount + 1
                                })}
                            )
                        })
                })
                .then(() => {
                    //updates the cart items
                    cartQuery.get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((item) => {
                                cartsRef.doc(item.id).update({
                                    isDeleted: true
                                })
                            })
                        })
                })
                .then(() => {
                    setIsFeedbackOpen(true)
                })

    }

    const handleCloseFeedback = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setIsFeedbackOpen(false)
    }
    if(!cartItems){
        return (
            <div>
                <h1>{`${displayName}'s Cart`}</h1>
                <div className={`${classes.demo} cart-list`}></div>
                Cart is empty
            </div>
        )
    }
    return (
        <div>
            <h1>{`${displayName}'s Cart`}</h1>
            <div className={`${classes.demo} cart-list`}>
                <List dense={true}>
                    {
                        cartItems.map(
                            (item, index) => 
                                item.isDeleted
                                    ? null
                                    : <CartItem album={item.album} key={index}/>
                            
                        )
                    }
                    <hr/>
                    <Typography variant="h6">
                        {`Total Amount ${getTotalAmountToBePaid(cartItems)}`}
                    </Typography>
                </List>
                <Button size="large"
                    onClick={handleCheckoutClick}
                >
                    Checkout
                </Button>
            </div>
            <Snackbar open={isFeedbackOpen} autoHideDuration={6000} onclose={handleCloseFeedback}>
                <Alert onClose={handleCloseFeedback} severity="success">
                    Purchase Successful!
                </Alert>
            </Snackbar>
        </div>
    )
}

function CartItem(props){
    const { album } = props;
    return (
        <ListItem className="cart-item" alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={`album cover`} src={albumPlaceholder}/>
            </ListItemAvatar>
            <ListItemText
                primary={album.title}
                secondary={`PHP ${album.price}`}
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="Delete">
                    <Delete/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>  
    )
}