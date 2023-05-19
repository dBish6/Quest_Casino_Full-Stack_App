import { useContext } from "react";
import { CacheContext } from "../contexts/Cache";

const useCache = () => {
  return useContext(CacheContext);
};

export default useCache;
