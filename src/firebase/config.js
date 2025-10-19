import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDW_P5zyje_GJ_tPxE_kG5P5AuQTOpiajs",
  authDomain: "tkp-dims.firebaseapp.com",
  projectId: "tkp-dims",
  storageBucket: "tkp-dims.firebasestorage.app",
  messagingSenderId: "622188171129",
  appId: "1:622188171129:web:39f4edff57f5610472e9a8"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app)

export default app
