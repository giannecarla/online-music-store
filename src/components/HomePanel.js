import '../App.css';
import React, { Fragment } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg'
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";

export default function HomePanel(){
    return (
        <Fragment>
            <Top10Albums />
            <Top10SongsPlayed />
        </Fragment>
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

function Top10Albums(){
    const albumsRef = FirebaseClient.store.collection('albums');
    const albumQuery = albumsRef.orderBy('buyCount').limit('10');
    const [albums] = useCollectionData(albumQuery, {idField: 'id'});
    console.log("albums: ", albums);

    return (
        <div>
            Top 10 Best Selling Albums
            <div className="top-album-list">
            {
                albums && albums.map(
                    (album, index) => {
                        return ( 
                            <TopAlbum 
                                album={album} 
                                rank={index+1} 
                                // songCount={songCount}
                                key={`top-album-${index}`}
                            /> )
                    }
                )
            }
            </div>
        </div>
    )
}

function TopAlbum(props){
    const { rank, album, songCount } = props;
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
                    #{rank} {album.title}
                </Typography>
                <Typography gutterBottom variant="body2" component="h2">
                    {songCount} Songs | {album.year}
                </Typography>
            </CardContent>
        </Card>
    )
}

function Top10SongsPlayed(){
    const songsRef = FirebaseClient.store.collection('songs');
    const songQuery = songsRef.orderBy('streamCount').limit('10');
    const [songs] = useCollectionData(songQuery, {idField: 'id'});
    return (
        <div>
            Top 10 Most Played All-Time
            <div className="top-song-list">
            {
                songs && songs.map(
                    (song, index) => {
                        return ( 
                            <TopSong 
                                song={song} 
                                rank={index+1} 
                                key={`top-song-${index}`}
                            /> )
                    }
                )
            }
            </div>
        </div>
    )
}

function TopSong(props){
    const { song, rank } = props;
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
                    #{rank} {song.title}
                </Typography>
                <Typography gutterBottom variant="body2" component="h2">
                    {song.artist}
                </Typography>
            </CardContent>
        </Card>
    )
}