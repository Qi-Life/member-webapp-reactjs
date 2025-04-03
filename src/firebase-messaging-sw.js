

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCbUGKXwhP5zGgtQ295UH_qSgF_3Vbkv2s",
    authDomain: "qicoil-1627102579298.firebaseapp.com",
    projectId: "qicoil-1627102579298",
    storageBucket: "qicoil-1627102579298.appspot.com",
    messagingSenderId: "942446389344",
    appId: "1:942446389344:web:2cae4618f54e7c38e5bb05",
    measurementId: "G-L90LL6211Z"
}

const firebase = initializeApp(firebaseConfig);



const messaging = getMessaging(firebase);

export { firebase, messaging };