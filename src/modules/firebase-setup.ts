import dotenv from 'dotenv'
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { initializeApp } from "firebase/app";

dotenv.config()

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
    measurementId: process.env.MEASUREMENTID,
  };
  
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
// Initialize the FirebaseUI Widget using Firebase.



export const auth = getAuth(app);