// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhsoeS-8qYXI0200C6jlgbra-5Ax1XoiA",
  authDomain: "studysync-c9282.firebaseapp.com",
  databaseURL: "https://studysync-c9282-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studysync-c9282",
  storageBucket: "studysync-c9282.appspot.com",
  messagingSenderId: "974446764523",
  appId: "1:974446764523:web:08406944162cc92a27b9ae",
  measurementId: "G-38MEN24NE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { database, auth, signInWithEmailAndPassword };