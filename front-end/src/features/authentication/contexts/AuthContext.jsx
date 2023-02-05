import { createContext, useState, useEffect } from "react";

// *Utility Import*
import firebase, { auth } from "../utils/firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, toggleLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const signInWithGoogle = () => {
    return auth.signInWithPopup(googleProvider);
  };

  const logout = () => {
    return auth.signOut();
  };

  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  const verifyEmail = () => {
    return currentUser.sendEmailVerification();
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

  // Exports pretty much, for provider.
  const value = {
    currentUser,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
