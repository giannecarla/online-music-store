import '../App.css';
import React, { Fragment } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg'
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";

export default function AllSongs(props){
    const { filter } = props;
    const songsRef = FirebaseClient.store.collection('songs');
    const query = filter 
        ? filter
        : songsRef.orderBy('streamCount');
    const [songs] = useCollectionData(query, {idField: 'id'})

    return (
        <div>
            {filter ? null : 'All Songs'}
            <div className="top-song-list">
            {
                songs && songs.map(
                    (song, index) => {
                        return <SongPreview song={song} key={`song-${index}`}/>
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


function SongPreview(props){
    const { song } = props;
    const classes = useStyles();
    return (
        <Card className="top-song">
            <CardMedia
                className={classes.media}
                title={`${song.title} song cover`}
                image={albumPlaceholder}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {song.title}
                </Typography>
                <Typography gutterBottom variant="body2" component="h2">
                    {song.timeDuration} {song.artist}
                </Typography>
            </CardContent>
        </Card>
    )

}