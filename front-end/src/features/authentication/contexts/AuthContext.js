/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

// *Utility Import*
import { auth } from "../../../utils/firebaseConfig";

// *API Services Imports*
import GetUserBalanceCompletedQuests from "../api_services/GetUserBalanceCompletedQuests";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loadingUser, toggleLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [balance, setBalance] = useState(null);
  const [completedQuests, setCompletedQuests] = useState(null);
  const { fetchBalanceAndCompletedQuests, abortController } =
    GetUserBalanceCompletedQuests();

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const verifyEmail = () => {
    return sendEmailVerification(currentUser);
  };

  // Sets current user.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        toggleLoading(false);
        // Logout after 12 hours if idle.
        let timer;
        window.addEventListener("mousemove", () => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            logout();
            return alert("Logged out due to inactivity.");
          }, 43200000);
        });
      } else {
        setCurrentUser(null);
        toggleLoading(false);
      }
      console.log(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser !== null && balance === null && completedQuests === null) {
      fetchBalanceAndCompletedQuests(
        currentUser.uid,
        setBalance,
        setCompletedQuests
      );

      return () => abortController.abort();
    }
  }, [currentUser]);

  const exports = {
    currentUser,
    loadingUser,
    balance,
    setBalance,
    completedQuests,
    setCompletedQuests,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={exports}>
      {!loadingUser && children}
    </AuthContext.Provider>
  );
};
