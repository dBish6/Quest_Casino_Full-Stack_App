/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../features/authentication/contexts/AuthContext";

export const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState({
    playersHighlight: null,
    userProfile: null,
    topPlayers: null,
    tipsEnabled: true,
  });
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem("tipsDisabled"))
      setCache({ ...cache, tipsEnabled: false });
  }, []);

  useEffect(() => {
    if (currentUser === null) {
      cache.userProfile && setCache((prev) => ({ ...prev, userProfile: null }));
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
