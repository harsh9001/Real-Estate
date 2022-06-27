// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYlAzcvXPLwF8SOZ3_G40X--F05gFJK8I",
    authDomain: "generated-tine-353910.firebaseapp.com",
    projectId: "generated-tine-353910",
    storageBucket: "generated-tine-353910.appspot.com",
    messagingSenderId: "243977261287",
    appId: "1:243977261287:web:9b36d31975ce25b9fc5242"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore()