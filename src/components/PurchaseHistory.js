import '../App.css';
import React, { Fragment, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg';
import { 
    Avatar,
    Card, CardHeader, CardMedia, CardContent, CardActions,
    List, ListItem, ListItemAvatar, ListItemText,
    Collapse, 
    Typography, 
    IconButton,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 900,
      minWidth: 500,
      overflow: "scroll",
      maxHeight: "-webkit-fill-available"
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
  }));


export default function PurchaseHistory(){
    const classes = useStyles();
    const { uid } = FirebaseClient.auth.currentUser
    const purchasesRef = FirebaseClient.store.collection('purchases').where('userId', '==', uid);
    const [purchaseHistory] = useCollectionData(purchasesRef, {idField: 'id'})
    return (
        <div className="history-table">
            {
                purchaseHistory && purchaseHistory.map(
                    (purchase) => {
                        return (
                            <Card className={"top-album"}>
                                <CardContent>
                                    <Typography align='left' gutterBottom variant="h5" component="h2">
                                        #{purchase.refNo}
                                    </Typography>
                                    <Typography align='left' gutterBottom variant="body2" component="h2">
                                        {purchase.timestamp}
                                    </Typography>
                                    <AlbumsBought albums={purchase.albums}/>
                                </CardContent>
                            </Card>
                        )
                    }
                )
            }
        </div>
    )
}

function AlbumsBought(props){
    const classes = useStyles();
    const { albums } = props;
    return (
        <List dense={true}>
            {
                albums && albums.map(
                    (album) => {
                        return (
                        <ListItem className={"top-album"}>
                            <ListItemAvatar>
                                <Avatar alt={`album cover`} src={album.image ? album.image : albumPlaceholder} />
                            </ListItemAvatar>
                            <ListItemText primary={`${album.title} | ${album.price}`} secondary={album.artist} />
                        </ListItem>)
                    }
                )
            }
        </List>
    )
}