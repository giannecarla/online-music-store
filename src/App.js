import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { Fragment } from 'react';
import { Button, Icon } from '@material-ui/core';
import MusicStore from './components/MusicStore';
import FirebaseClient from './FirebaseClient';

const auth = FirebaseClient.auth;
const firestore = FirebaseClient.store;
function App() {
  const [user] = useAuthState(auth);

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

export default App;
