import '../App.css';
import React, { Fragment, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg';
import moment from 'moment';
import { 
    Collapse, 
    Card, CardHeader, CardMedia, CardContent, CardActions,
    Typography, 
    IconButton } from "@material-ui/core";
import { ShoppingCart, ExpandMore} from '@material-ui/icons'
import AllSongs from './AllSongs';

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

export default function Album(props){
    const classes = useStyles();
    const { album } = props;
    const cartRef = FirebaseClient.store.collection('carts');
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    console.log("Carts Ref: ", cartRef);

    const handleAddCartClick = async() => {
        const { uid } = FirebaseClient.auth.currentUser;
        await cartRef.add({
            userId: uid,
            albumId: album.uid,
            createdAt: moment().format("MM/DD/YYYY HH:MM")
        })
    }

    const subHeader = (
        <p>{`${album.artist} | ${album.year}`}</p>
    )
    return (
        <Card className={classes.root}>
            <CardHeader title={album.title} subheader={subHeader}/>
            <CardMedia 
                className={classes.media} 
                image={albumPlaceholder} 
                title={`${album.title} Album Cover`}
            />
            <CardContent>
                <Typography variant="h6" color="textPrimary" component="p">
                    PHP {album.price}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton 
                    aria-label="add to cart"
                    onClick={handleAddCartClick}>
                    <ShoppingCart />
                </IconButton>
                {/* <IconButton 
                    aria-label="show songs"
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                >
                    <ExpandMore />
                </IconButton> */}
            </CardActions>
            <AlbumSongs albumId={album.uid}/>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <AlbumSongs albumId={album.uid}/>
                </CardContent>
            </Collapse>
        </Card>
    )

}



function AlbumSongs(props){
    const { albumId } = props;
    const songsRef = FirebaseClient.store.collection('songs');
    const query = songsRef.where('album', '==', albumId);
    const [songs] = useCollectionData(query, {idField: 'id'})

    return (
        <AllSongs filter={query} />
    )
}