import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Fragment } from 'react';
import { Button, Icon } from '@material-ui/core';
import MusicStore from './MusicStore';
firebase.initializeApp({
    apiKey: "AIzaSyC_jNUWzSU_60t6dSxR2BhWpqIKQrS_Ntc",
    authDomain: "online-music-store-c8e1a.firebaseapp.com",
    projectId: "online-music-store-c8e1a",
    storageBucket: "online-music-store-c8e1a.appspot.com",
    messagingSenderId: "830732189649",
    appId: "1:830732189649:web:d6514517458f6ee9cc6af0",
    measurementId: "G-NSM027JXH5"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  console.log("MY USER: ", user);
  return (
    <div className="App">
      { user ? <MusicStore user={user}/> : <SignIn/>}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="Login">
      <div className="title">
        <div className="app-title head">
          <span>
            Huni
          </span>
        </div>
        <Button 
          size="large"
          onClick={signInWithGoogle}
          variant="contained"
          color="secondary">
            <i className="fab fa-google"></i> 
            Sign in with Google
        </Button>
      </div>
      <a 
        className="resource-credit" 
        href='https://www.freepik.com/photos/background'
      >
          Background photo created by rawpixel.com - www.freepik.com
      </a>
    </div>
  )
}

function SignOut() {
  return auth.currentUser && (
      <Button
        onClick={() => auth.signOut()}
      >
        <i className="fas fa-sign-out-alt"></i>
        Sign Out
      </Button>
  ) 
}

function HeaderMenu(){
  return (
    <div className="header-menu">
      <Button>Huni</Button>
      <Button>Songs</Button>
      <Button>Albums</Button>
      <Button><i className="fas fa-shopping-cart"/>Cart</Button>
      <SignOut/>
    </div>
  )
}

function Homepage(){
  return (
    <Fragment>
      <HeaderMenu />
    </Fragment>
  )
}
export default App;
