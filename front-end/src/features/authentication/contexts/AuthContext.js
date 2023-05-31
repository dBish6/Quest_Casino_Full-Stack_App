/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { createStandaloneToast } from "@chakra-ui/toast";

// *Utility Import*
import { auth } from "../../../utils/firebaseConfig";

// *Redux Imports*
import { useDispatch, useSelector } from "react-redux";
import { FULL_CLEAR } from "../../games/blackjack/redux/blackjackSlice";
import { selectGameType } from "../../games/blackjack/redux/blackjackSelectors";

// *API Services Import*
import GetSessionStatus from "../api_services/GetSessionStatus";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loadingUser, toggleLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // Firebase Auth user.
  const [csrfToken, setCsrfToken] = useState(null);

  const handleCheckSessionStatus = GetSessionStatus();
  const { toast } = createStandaloneToast();
  const navigate = useNavigate();
  const gameType = useSelector(selectGameType);
  const dispatch = useDispatch();

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const clear = () => {
    gameType && dispatch(FULL_CLEAR()); // Clears the blackjack redux.
    setCurrentUser(null);
    setCsrfToken(null);
  };

  const logout = () => {
    clear();
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Maintains the user by session cookie.
  useEffect(() => {
    const checkUser = async () => {
      toggleLoading(true);
      const serverRes = await handleCheckSessionStatus();
      if (serverRes) {
        if (serverRes.status === 200 && serverRes.data.session) {
          currentUser === null && setCurrentUser(serverRes.data.authUser);
          csrfToken === null && setCsrfToken(serverRes.data.token);
          try {
            await signInWithEmailLink(
              auth,
              serverRes.data.authUser.email,
              serverRes.data.emailLink
            );
          } catch (error) {
            console.error(error);
            clear();
            toast({
              description:
                "An unexpected error occurred when trying to maintain your login session, refresh the page and see if you get logged in. If not, please try and log in again. If the issue persists, please contact support for further assistance.",
              status: "error",
              duration: 99999999,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
          }
        } else if (serverRes.status === 401) {
          if (serverRes.data.ERROR.includes("Invalid")) {
            currentUser !== null && navigate("/error401");
          } else if (serverRes.data.ERROR === "Session cookie expired.") {
            currentUser !== null && (await logout());
            alert("Your session is expired, please processed to login.");
          }
        }
      }
      toggleLoading(false);
    };
    checkUser();
  }, []);

  // useEffect(() => {
  //   console.log("currentUser", currentUser);
  //   console.log("csrfToken", csrfToken);
  // }, [currentUser, csrfToken]);

  const exports = {
    currentUser,
    setCurrentUser,
    loadingUser,
    csrfToken,
    setCsrfToken,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={exports}>
      {!loadingUser && children}
    </AuthContext.Provider>
  );
};
