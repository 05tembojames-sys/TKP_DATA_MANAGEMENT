import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
  enableMultiTabIndexedDbPersistence,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn("Firebase persistence failed: Multiple tabs open");
  } else if (err.code == "unimplemented") {
    // The current browser doesn't support persistence
    console.warn("Firebase persistence not supported by browser");
  }
});

// Function to manually control network status for Firestore
export const setFirestoreNetworkStatus = async (online) => {
  try {
    if (online) {
      await enableNetwork(db);
      console.log("Firebase network enabled");
    } else {
      await disableNetwork(db);
      console.log("Firebase network disabled");
    }
  } catch (error) {
    console.error("Error changing Firestore network status:", error);
    throw error;
  }
};

export default app;
