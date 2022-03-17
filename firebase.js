// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCUngSQnn8iBFyDmMg0Truj0NbUQFkVrqM',
  authDomain: 'instagram-copy-b78d2.firebaseapp.com',
  projectId: 'instagram-copy-b78d2',
  storageBucket: 'instagram-copy-b78d2.appspot.com',
  messagingSenderId: '621784470971',
  appId: '1:621784470971:web:2dde336724e0b0f390a09e',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const storage = getStorage()

export { app, db, storage }
