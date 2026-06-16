import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'mock',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'mock'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const googleSignIn = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

export const initAuth = (onSuccess: (user: User, token: string) => void, onFail: () => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      onSuccess(user, token);
    } else {
      onFail();
    }
  });
};
