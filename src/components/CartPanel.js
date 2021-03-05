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
    Button,
    Checkbox,
    Paper,
    Snackbar,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    TableBody
} from '@material-ui/core'
import {Delete} from '@material-ui/icons';
import moment from 'moment';
const useStyles = makeStyles((theme) => ({
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    table: {
        minWidth: 700,
      },
    cartTableRoot: {
        width: 700,
        margin: '3% auto'
    },
    cartTableBody: {
        fontWeight: 18
    },
    multiContent: {
            margin: '0 2%'
        }
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

let selectedOnCart = []
function onClickCheckBox(event, cartId){
    if(event.target.checked) selectedOnCart.push(cartId);
    else{
        selectedOnCart.splice(
            selectedOnCart.indexOf(cartId),
            1
        )
    }
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
    const [alertMessage, setAlertMessage] = useState("");
    const handleDeleteItemsOnCart = async() => {
        let updateCart = Promise.resolve(
            selectedOnCart.map((cartItemId) => {
                cartsRef.doc(cartItemId).update({
                    isDeleted: true})
            }))
        await updateCart
                .then( () => {
                    selectedOnCart = [];
                    setAlertMessage('Successfully deleted item(s) in cart.');
                    setIsFeedbackOpen(true);
                })
    }
    const handleCheckoutClick = async() => {

        let addPurchase = purchasesRef.add({
            refNo: `A_${moment().format('MMDDYYYYHHmmss')}`,
            userId: uid,
            timestamp: moment().format("MM/DD/YYYY HH:MM"),
            albums: cartItems.map((items) => items.album)
        })

        await addPurchase
                .then((checkoutRef) => {
                    //updates the buy count for each album
                    let albumIds = cartItems.map(
                        cartItem => { return cartItem && cartItem.album.uid}
                    );
                    albumsRef.where('uid', 'in', albumIds).get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((item) => 
                            {
                                let addend = albumIds.filter(uid => uid === item.data().uid).length;
                                albumsRef.doc(item.id).update({
                                    buyCount: item.data().buyCount + addend
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
                    setAlertMessage('Purchase sucessful!')
                    setIsFeedbackOpen(true);
                    selectedOnCart = []
                })

    }

    const handleCloseFeedback = (event, reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setIsFeedbackOpen(false)
    }

    return(
        <Fragment>
        {
            !cartItems || cartItems.length==0
                ? <div className="empty-set">
                    Cart is empty.
                  </div>
                : <Fragment>
        <TableContainer component={Paper} className={classes.cartTableRoot}>
            <Table className={classes.table} aria-label={"Cart"}>
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Album</TableCell>
                        <TableCell align="center">Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.cartTableBody}>
                    {cartItems.map((item, index) => {
                        // const isItemSelected = isSelected(row.name);
                        const labelId = `checkbox-${index}`;
                        return (<TableRow key={index}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                onChange={(e) => onClickCheckBox(e, item.id)}
                                inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </TableCell>
                            <TableCell className={"multicontent-table-cell"}>
                                <Avatar alt={`album cover`} src={item.album.image ? item.album.image : albumPlaceholder}/>
                                <p className={classes.multiContent}>{item.album.title}</p>
                            </TableCell>
                            <TableCell align="center" >{item.album.price}</TableCell>
                        </TableRow>)
                    })}
                    <TableRow>
                        <TableCell/>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">{getTotalAmountToBePaid(cartItems)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        <div className={"cart-footer"}>
            <Button size="large" variant="contained" color="default"
                onClick={handleDeleteItemsOnCart}
            >
                <Delete />
            </Button>
            <Button size="large" variant="contained" color="secondary"
                onClick={handleCheckoutClick}
            >
                Checkout Cart
            </Button>
        </div>
        
        </Fragment>
        }
        <Snackbar open={isFeedbackOpen} autoHideDuration={6000} onClose={handleCloseFeedback}>
            <Alert onClose={handleCloseFeedback} severity="success">
                {alertMessage}
            </Alert>
        </Snackbar>
        </Fragment>
    )
}