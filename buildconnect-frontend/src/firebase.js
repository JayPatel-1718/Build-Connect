// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCwHDdA_q2VJ26CgWiZGn4sstFdENyJeDU",
  authDomain: "buildconnect-aef10.firebaseapp.com",
  projectId: "buildconnect-aef10",
  storageBucket: "buildconnect-aef10.firebasestorage.app",
  messagingSenderId: "137344366641",
  appId: "1:137344366641:web:b2872cabe4683b5c2ebd10",
  measurementId: "G-8S840BLML0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);