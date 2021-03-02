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

export default function CartPanel(){
    const classes = useStyles();
    const purchasesRef = FirebaseClient.store.collection('purchases');
    const albumsRef = FirebaseClient.store.collection('albums')
    const { uid, displayName } = FirebaseClient.auth.currentUser;
    const cartsRef = FirebaseClient.store.collection('carts')
    const cartQuery = cartsRef.where('userId', '==', uid).where('isDeleted', '==', false);
    const [cartItems] = useCollectionData( cartQuery, {idField: 'id'})
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const handleCheckoutClick = async() => {

        let addPurchase = purchasesRef.add({
            refNo: `A_${moment().format('MMDDYYYYHHMM')}`,
            userId: uid,
            timestamp: moment().format("MM/DD/YYYY HH:MM"),
            albums: cartItems.map((items) => items.album)
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

    return(
        <Fragment>
        {
            !cartItems || cartItems.length==0
                ? <div className="empty-set">Cart is empty.</div>
                : <Fragment>
        <TableContainer component={Paper} className={classes.cartTableRoot}>
            <Table className={classes.table} aria-label={"Cart"}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Album</TableCell>
                        <TableCell align="center">Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className={classes.cartTableBody}>
                    {cartItems.map((item, index) => {
                        return (<TableRow key={index}>
                            <TableCell>{index++}</TableCell>
                            <TableCell className={"multicontent-table-cell"}>
                                <Avatar alt={`album cover`} src={albumPlaceholder}/>
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
        <Button size="large" variant="contained" color="secondary"
            onClick={handleCheckoutClick}
        >
            Checkout
        </Button>
        </Fragment>
        }
        <Snackbar open={isFeedbackOpen} autoHideDuration={6000} onclose={handleCloseFeedback}>
            <Alert onClose={handleCloseFeedback} severity="success">
                Purchase successful!
            </Alert>
        </Snackbar>
        </Fragment>
    )
}