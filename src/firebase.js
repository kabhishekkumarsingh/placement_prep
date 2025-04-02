import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCW1wrfLunWgpuKgZqEPJ2omKfgcLvQV2o",
    authDomain: "placement-prepration.firebaseapp.com",
    projectId: "placement-prepration",
    storageBucket: "placement-prepration.firebasestorage.app",
    messagingSenderId: "246666485587",
    appId: "1:246666485587:web:0dabc5f350e35afdcb0ba6",
    measurementId: "G-LB7X0ZVZR1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, collection, addDoc, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc, getDoc, setDoc };
