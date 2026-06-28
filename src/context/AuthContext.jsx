import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('admin_token', idToken);
          setToken(idToken);
          setUser(firebaseUser);
        } catch (error) {
          console.error('Error fetching token:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('admin_token');
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('admin_token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (username, password) => {
    // Standardize username to email if it does not contain '@'
    const email = username.includes('@') ? username : `${username}@fantasyisland.com`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      localStorage.setItem('admin_token', idToken);
      setToken(idToken);
      setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      console.warn('Login attempt failed, trying provisioning fallback:', error);
      
      // If user not found, or invalid credential (which can happen on empty projects),
      // we attempt to provision the credential on the first login to ensure usability.
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/invalid-email'
      ) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const idToken = await userCredential.user.getIdToken();
          
          localStorage.setItem('admin_token', idToken);
          setToken(idToken);
          setUser(userCredential.user);
          return { success: true };
        } catch (createError) {
          return { 
            success: false, 
            message: createError.message || 'Authentication failed' 
          };
        }
      }

      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('admin_token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
