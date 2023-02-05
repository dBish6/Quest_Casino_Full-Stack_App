import { useContext } from "react";
import { AuthContext } from "../features/authentication/contexts/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
