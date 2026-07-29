import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Use standard vite environment variables if possible, but since we are in AI Studio,
// we fetch the config. In this case, we'll try to load it dynamically if it exists,
// or just use a standard configuration approach.
// Since we have the config file, we can import it.
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
