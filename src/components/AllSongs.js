import '../App.css';
import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg'
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";
import Miniplayer from './Miniplayer';

export default function AllSongs(props){
    const { filter } = props;
    const songsRef = FirebaseClient.store.collection('songs');
    const query = filter 
        ? filter
        : songsRef.orderBy('streamCount', 'desc');
    const [songs] = useCollectionData(query, {idField: 'id'})
    const [miniplayerSong, setMiniplayerSong] = useState('')

    return (
        <div>
            {filter ? null : <h1>All Songs</h1>}
            <div className="top-song-list">
            {
                songs && songs.map(
                    (song, index) => {
                        return (
                            <SongPreview 
                                song={song} 
                                key={`song-${index}`}
                                onClick={(song) => {setMiniplayerSong(song)}}/>)
                    }
                )
            }
            <Miniplayer song={miniplayerSong}/>
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
    const { song, onClick } = props;
    const classes = useStyles();
    const songsRef = FirebaseClient.store.collection('songs');
    const handlePlaySong = async() => {
        onClick && onClick(song);
        await songsRef.doc(song.id).update({
            streamCount: song.streamCount + 1
        })
    }
    return (
        <Card 
            className="top-song"
            onClick={() => handlePlaySong()}>
            <CardMedia
                className={classes.media}
                title={`${song.title} song cover`}
                image={song.image ? song.image : albumPlaceholder}
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