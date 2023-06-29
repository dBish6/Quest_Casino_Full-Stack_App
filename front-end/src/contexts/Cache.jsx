/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../features/authentication/contexts/AuthContext";

// *API Services Import*
import GetUserBalanceCompletedQuests from "../features/authentication/api_services/GetUserBalanceCompletedQuests";

export const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState({
    playersHighlight: null,
    userProfile: null,
    fetchBalAndComQuestsComplete: false,
    topPlayers: null,
    tipsEnabled: true,
    isUsingKeyboard: false,
  });
  const { currentUser } = useContext(AuthContext);
  const { fetchBalanceAndCompletedQuests, abortController } =
    GetUserBalanceCompletedQuests();

  useEffect(() => {
    if (localStorage.getItem("tipsDisabled"))
      setCache({ ...cache, tipsEnabled: false });
  }, []);

  // To capture if the user is using the keyboard to navigate.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Tab" || event.key === "Escape") {
        setCache((prev) => ({ ...prev, isUsingKeyboard: true }));
        document.removeEventListener("keydown", handleKeyDown);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (currentUser === null) {
      cache.userProfile && setCache((prev) => ({ ...prev, userProfile: null }));
    } else if (!cache.userProfile) {
      fetchBalanceAndCompletedQuests(currentUser.uid, setCache).then(() =>
        setCache((prev) => ({ ...prev, fetchBalAndComQuestsComplete: true }))
      );

      return () => abortController.abort();
    }
  }, [currentUser]);

  // useEffect(() => {
  //   console.log(cache);
  // }, [cache]);

  return (
    <CacheContext.Provider value={{ cache, setCache }}>
      {children}
    </CacheContext.Provider>
  );
};
