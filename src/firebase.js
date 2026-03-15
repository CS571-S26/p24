// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
  authDomain: "cs571-demo-f34ae.firebaseapp.com",
  projectId: "cs571-demo-f34ae",
  storageBucket: "cs571-demo-f34ae.firebasestorage.app",
  messagingSenderId: "1010341572696",
  appId: "1:1010341572696:web:a77239703baa649f6a1a2d",
  measurementId: "G-WYMECJNQ7Y"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Export Firestore database instance for use in the app
export const db = getFirestore(app);
