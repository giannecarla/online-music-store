import '../App.css';
import React, { Fragment, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FirebaseClient from '../FirebaseClient';
import albumPlaceholder from '../assets/undraw_compose_music_ovo2.svg'
import { Card, CardMedia, CardContent, Typography, Modal } from "@material-ui/core";
import Album from './Album';
import Miniplayer from './Miniplayer';

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
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
  });

function Top10Albums(){
    const albumsRef = FirebaseClient.store.collection('albums');
    const albumQuery = albumsRef.orderBy('buyCount', 'desc').limit('10');
    const [albums] = useCollectionData(albumQuery, {idField: 'id'});

    return (
        <div>
            <h1>Top 10 Best Selling Albums</h1>
            <div className="top-album-list">
            {
                albums && albums.map(
                    (album, index) => {
                        return ( 
                            <TopAlbum 
                                album={album} 
                                rank={index+1}
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
    const { rank, album } = props;
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
            className="top-chart album"
            onClick={handleOpenAlbum}>
            <CardMedia
                className={classes.media}
                title={`${album.title} album cover`}
                image={album.image ? album.image : albumPlaceholder} 
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    #{rank} {album.title}
                </Typography>
                <Typography gutterBottom variant="body2" component="h2">
                    {album.songCount} Songs | {album.year}
                </Typography>
                <Typography variant="body2" component="h2">
                    Sold copies ⦁ {album.buyCount}
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

function Top10SongsPlayed(){
    const songsRef = FirebaseClient.store.collection('songs');
    const songQuery = songsRef.orderBy('streamCount', 'desc').limit('10');
    const [songs] = useCollectionData(songQuery, {idField: 'id'});
    return (
        <div>
            <h1>Top 10 Most Played All-Time</h1>
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
    const [miniplayerSong, setMiniplayerSong] = React.useState('')
    const songsRef = FirebaseClient.store.collection('songs');
    const handlePlaySong = async() => {
        setMiniplayerSong(song);
        await songsRef.doc(song.id).update({
            streamCount: song.streamCount + 1
        })
    }
    return (
        <Fragment>
        <Card 
            className="top-chart song"
            onClick={() => handlePlaySong()}>
            <CardMedia
                className={classes.media}
                title={`${song.title} song cover`}
                image={song.image ? song.image : albumPlaceholder}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    #{rank} {song.title}
                </Typography>
                <Typography gutterBottom variant="body2" component="h2">
                    {song.artist}
                </Typography>
                <Typography variant="body2" component="h2">
                    Stream Count ⦁ {song.streamCount}
                </Typography>
            </CardContent>
        </Card>
        <Miniplayer song={miniplayerSong}/>
        </Fragment>
    )
}