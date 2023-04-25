/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect } from "react";

export const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
  const [cache, setCache] = useState({
    playersHighlight: null,
    userProfile: null,
    topPlayers: null,
    tipsEnabled: true,
  });

  useEffect(() => {
    console.log(cache);
  }, [cache]);

  useEffect(() => {
    if (localStorage.getItem("tipsDisabled"))
      setCache({ ...cache, tipsEnabled: false });
  }, []);

  return (
    <CacheContext.Provider value={{ cache, setCache }}>
      {children}
    </CacheContext.Provider>
  );
};
