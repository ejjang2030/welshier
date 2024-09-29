import {initializeApp, FirebaseApp, getApp} from "firebase/app";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import {i18n} from "i18next";

export let app: FirebaseApp;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

try {
  app = getApp(process.env.REACT_APP_FIREBASE_APP_NAME);
} catch (error) {
  app = initializeApp(firebaseConfig, process.env.REACT_APP_FIREBASE_APP_NAME);
}

const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default firebase;
