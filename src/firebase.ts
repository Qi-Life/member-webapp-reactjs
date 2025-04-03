// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbUGKXwhP5zGgtQ295UH_qSgF_3Vbkv2s",
    authDomain: "qicoil-1627102579298.firebaseapp.com",
    projectId: "qicoil-1627102579298",
    storageBucket: "qicoil-1627102579298.appspot.com",
    messagingSenderId: "942446389344",
    appId: "1:942446389344:web:2cae4618f54e7c38e5bb05",
    measurementId: "G-L90LL6211Z"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

const firestore = getFirestore(firebase);

const messaging = getMessaging(firebase);

export { firebase, firestore, messaging };
