import '../App.css';
import React, { Fragment } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg'
import { Card, CardMedia, CardContent, Typography, Modal } from "@material-ui/core";
import Album from './Album';

export default function AllAlbums(){
    const albumsRef = FirebaseClient.store.collection('albums');
    const query = albumsRef.orderBy('year', 'desc');
    const [albums] = useCollectionData(query, {idField: 'id'})

    return (
        <div>
            <h1>All albums</h1>
            <div className="top-album-list">
            {
                albums && albums.map(
                    (album, index) => {
                        return <AlbumPreview album={album} key={`album-${index}`}/>
                    }
                )
            }
            </div>
        </div>
    )
}

const useStyles = makeStyles({
    root: {
      maxWidth: 345
    },
    media: {
      height: 140
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '-webkit-fill-available'
      },
  });


function AlbumPreview(props){
    const { album, songCount } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleOpenAlbum = () => {
        setOpen(true);
      };
    
      const handleCloseAlbum = () => {
        setOpen(false);
      };
    
    return (
        <Fragment>
        <Card 
            className="top-album" 
            onClick={handleOpenAlbum}>
            <CardMedia
                className={classes.media}
                title={`${album.title} album cover`}
                image={albumPlaceholder}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {album.title}
                </Typography>
                <Typography gutterBottom variant="body2" component="h2">
                    {album.artist} | {album.year}
                </Typography>
            </CardContent>
        </Card>
        <Modal
            disableScrollLock={true}
            open={open}
            onClose={handleCloseAlbum}
            aria-labelledby="View Album"
            aria-describedby="Album Details"
            className={classes.modal}
        >
            <Album album={album}/>
        </Modal>
        </Fragment>
    )
}