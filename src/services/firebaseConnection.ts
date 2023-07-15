// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEcibTxH_56XdzGMOUocs48u2jQi3Ev4w",
  authDomain: "tarefasplus-2ab3f.firebaseapp.com",
  projectId: "tarefasplus-2ab3f",
  storageBucket: "tarefasplus-2ab3f.appspot.com",
  messagingSenderId: "180041149104",
  appId: "1:180041149104:web:f1b159080e2affedc7e975"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp)