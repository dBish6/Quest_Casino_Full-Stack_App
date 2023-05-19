/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";
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
import {
  useDispatch,
  // useSelector
} from "react-redux";
import { FULL_RESET } from "../../games/blackjack/redux/blackjackSlice";
// import { selectGameType } from "../../games/blackjack/redux/blackjackSelectors";

// *API Services Imports*
import GetUserBalanceCompletedQuests from "../api_services/GetUserBalanceCompletedQuests";
import GetSessionStatus from "../api_services/GetSessionStatus";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loadingUser, toggleLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [balance, setBalance] = useState(null);
  const [completedQuests, setCompletedQuests] = useState(null);

  const dispatch = useDispatch();
  // const gameType = useSelector(selectGameType);
  const handleCheckSessionStatus = GetSessionStatus();
  const { fetchBalanceAndCompletedQuests, abortController } =
    GetUserBalanceCompletedQuests();
  const { toast } = createStandaloneToast();

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const clear = () => {
    setCurrentUser(null);
    setCsrfToken(null);
    setBalance(null);
    setCompletedQuests(null);
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
            // console.log("UNAUTHENTICATED");
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

  // Gets and sets user balance and completed while checking if the session cookie is expired.
  useEffect(() => {
    if (currentUser !== null && balance === null && completedQuests === null) {
      fetchBalanceAndCompletedQuests(
        currentUser.uid,
        setBalance,
        setCompletedQuests
      );

      return () => abortController.abort();
    } else if (currentUser === null) {
      // If the user is logged out, clear the persisted blackjack redux.
      // console.log("START", gameType);
      // console.log("BLACKJACK CLEARED");
      dispatch(FULL_RESET());
    }
  }, [currentUser]);

  // useEffect(() => {
  //   console.log("currentUser", currentUser);
  //   console.log("csrfToken", csrfToken);
  // }, [currentUser, csrfToken]);

  // useEffect(() => {
  //   console.log("completedQuests", completedQuests);
  // }, [completedQuests]);

  const exports = {
    currentUser,
    setCurrentUser,
    loadingUser,
    csrfToken,
    setCsrfToken,
    balance,
    setBalance,
    completedQuests,
    setCompletedQuests,
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
