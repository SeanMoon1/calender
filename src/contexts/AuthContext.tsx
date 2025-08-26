import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, AuthContextType } from '../types';
import { sanitizeNickname } from '../utils/validation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, nickname: string) {
    // 닉네임 정규화
    const sanitizedNickname = sanitizeNickname(nickname);
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with sanitized nickname
    await updateProfile(result.user, {
      displayName: sanitizedNickname
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      nickname: sanitizedNickname,
      createdAt: new Date(),
      isHost: true
    });

    return result;
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Create user document for new Google user
      const displayName = result.user.displayName || result.user.email?.split('@')[0] || 'user';
      const sanitizedNickname = sanitizeNickname(displayName);
      
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        nickname: sanitizedNickname,
        createdAt: new Date(),
        isHost: true
      });
    }
    
    return result;
  }

  function logout() {
    return signOut(auth);
  }

  async function getUserData(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        const userData = await getUserData(user.uid);
        if (userData) {
          setCurrentUser(userData);
        } else {
          // Fallback if userData is null
          const displayName = user.displayName || user.email?.split('@')[0] || 'user';
          const sanitizedNickname = sanitizeNickname(displayName);
          
          setCurrentUser({
            uid: user.uid,
            email: user.email || '',
            nickname: sanitizedNickname,
            isHost: true,
            createdAt: new Date()
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    getUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
