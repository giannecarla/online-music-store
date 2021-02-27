import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyC_jNUWzSU_60t6dSxR2BhWpqIKQrS_Ntc",
    authDomain: "online-music-store-c8e1a.firebaseapp.com",
    projectId: "online-music-store-c8e1a",
    storageBucket: "online-music-store-c8e1a.appspot.com",
    messagingSenderId: "830732189649",
    appId: "1:830732189649:web:d6514517458f6ee9cc6af0",
    measurementId: "G-NSM027JXH5"
  }

// var firebaseApp = firebase.initializeApp(firebaseConfig);
const FirebaseClient = {
    app: firebase.initializeApp(firebaseConfig),
    store: firebase.firestore(),
    auth: firebase.auth()
}
export default FirebaseClient;