// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH6eiWOiqR0WyPFTYP4_4coa4xzebDNlE",
  authDomain: "pantry-tracker-93824.firebaseapp.com",
  projectId: "pantry-tracker-93824",
  storageBucket: "pantry-tracker-93824.appspot.com",
  messagingSenderId: "425898430094",
  appId: "1:425898430094:web:5226ee9910e1ec4d9443df",
  measurementId: "G-GGS2S8HYCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};