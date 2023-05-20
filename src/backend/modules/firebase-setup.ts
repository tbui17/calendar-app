import {GoogleAuthProvider, getAuth} from "firebase/auth";

import {getFirestore} from "firebase/firestore"
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFiSrhwjFacTglmoQVn_hdMsLIV_958-o",
    authDomain: "calendar-app-7d35d.firebaseapp.com",
    projectId: "calendar-app-7d35d",
    storageBucket: "calendar-app-7d35d.appspot.com",
    messagingSenderId: "487907259037",
    appId: "487907259037:web:33a54e34928dd75d605a74",
    measurementId: "G-FVFM4CCDRS",
  };
  
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()

