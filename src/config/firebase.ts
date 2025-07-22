// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqiNuLox8hGaW59LPusyC313X1TUUfsEw",
  authDomain: "gestion-stage-43bd2.firebaseapp.com",
  projectId: "gestion-stage-43bd2",
  storageBucket: "gestion-stage-43bd2.firebasestorage.app",
  messagingSenderId: "245041279902",
  appId: "1:245041279902:web:0c093c2f54a2e3d9bfdc8f",
  measurementId: "G-P9EX48E73K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };