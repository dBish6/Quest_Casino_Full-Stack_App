import { useContext } from "react";
import { CacheContext } from "../contexts/cache";

const useCache = () => {
  return useContext(CacheContext);
};

export default useCache;
