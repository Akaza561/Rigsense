import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB-zrH_76HRjxJV97ckrSlKPn9ubxvSwkY",
    authDomain: "rigsense-auth.firebaseapp.com",
    projectId: "rigsense-auth",
    storageBucket: "rigsense-auth.firebasestorage.app",
    messagingSenderId: "599028283301",
    appId: "1:599028283301:web:fec72e784350924a2bda4c",
    measurementId: "G-C524YTVJH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
