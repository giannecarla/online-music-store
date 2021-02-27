import '../App.css';
import React, { Fragment } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg'
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";

export default function AllAlbums(){
    const albumsRef = FirebaseClient.store.collection('albums');
    const query = albumsRef.orderBy('year');
    const [albums] = useCollectionData(query, {idField: 'id'})

    return (
        <div>
            All albums
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
    }
  });


function AlbumPreview(props){
    const { album, songCount } = props;
    const classes = useStyles();
    return (
        <Card className="top-album">
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
    )
}