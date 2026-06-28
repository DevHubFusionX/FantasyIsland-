import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIol6zE3rAL8DhuqFGD4rxkjtrQ7tLGRk",
  authDomain: "fantasyisland-73e04.firebaseapp.com",
  projectId: "fantasyisland-73e04",
  storageBucket: "fantasyisland-73e04.firebasestorage.app",
  messagingSenderId: "703544518580",
  appId: "1:703544518580:web:327d677958338b9e8bb4e1",
  measurementId: "G-4LF8S6J0GQ"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const getDb = async () => {
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app);
};

export const getStorage = async () => {
  const { getStorage } = await import('firebase/storage');
  return getStorage(app);
};

export default app;
