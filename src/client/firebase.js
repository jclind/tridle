// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB_xv9X_dR-Yy-FNpT7cBmL6_ssZ7Kc1u4',
  authDomain: 'tridle-330b8.firebaseapp.com',
  projectId: 'tridle-330b8',
  storageBucket: 'tridle-330b8.appspot.com',
  messagingSenderId: '262854413360',
  appId: '1:262854413360:web:f3dc3b2fd24f02db1ff1f5',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
