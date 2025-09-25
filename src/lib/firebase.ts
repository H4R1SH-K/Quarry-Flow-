// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// This function initializes and returns the Firebase app instance.
// It ensures that Firebase is initialized only once.
export function getFirebaseApp(): FirebaseApp | null {
    if (getApps().length) {
        return getApp();
    }

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn("Firebase configuration is missing or incomplete. Cloud features will be disabled.");
      return null;
    }

    try {
        return initializeApp(firebaseConfig);
    } catch (error) {
        console.error("Failed to initialize Firebase app:", error);
        return null;
    }
}
