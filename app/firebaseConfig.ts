// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJM5N5E79MW-hAoYUPmgbMB6yLdw51-es",
  authDomain: "cvs-innovation-demo.firebaseapp.com",
  projectId: "cvs-innovation-demo",
  storageBucket: "cvs-innovation-demo.appspot.com",
  messagingSenderId: "179280619779",
  appId: "1:179280619779:web:45a108ed38311e32d3a136",
  measurementId: "G-515FT9WGNK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);