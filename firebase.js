// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZQAUg80Rb-5U0NG2lXtDA7j-tFNW8r9I",
  authDomain: "imaginify-94c23.firebaseapp.com",
  projectId: "imaginify-94c23",
  storageBucket: "imaginify-94c23.appspot.com",
  messagingSenderId: "402069694250",
  appId: "1:402069694250:web:547bd7b46f78d11bc16053",
  measurementId: "G-XJ75K0Q63G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
