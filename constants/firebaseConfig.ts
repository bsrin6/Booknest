// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAKt3xnQ4C4TIFPWQ_89oenvItHs9o3ehU",
    authDomain: "booknest-33f7d.firebaseapp.com",
    projectId: "booknest-33f7d",
    storageBucket: "booknest-33f7d.firebasestorage.app",
    messagingSenderId: "511567793034",
    appId: "1:511567793034:web:20ed91bec77963734e9673"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
