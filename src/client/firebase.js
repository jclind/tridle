// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB_xv9X_dR-Yy-FNpT7cBmL6_ssZ7Kc1u4',
  authDomain: 'tridle-330b8.firebaseapp.com',
  projectId: 'tridle-330b8',
  storageBucket: 'tridle-330b8.appspot.com',
  messagingSenderId: '262854413360',
  appId: '1:262854413360:web:f3dc3b2fd24f02db1ff1f5',
  measurementId: 'G-CTZNW623H2',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore()
export const analytics = getAnalytics(app)
