import { useState } from "react";
import { useNavigate } from "react-router-dom";

// *Custom Hooks Imports*
import useAuth from "../../../hooks/useAuth";
import useCache from "../../../hooks/useCache";

const PostLogout = () => {
  const [unexpectedErr, setUnexpectedErr] = useState("");
  const { logout } = useAuth();
  const { cache, setCache } = useCache();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setUnexpectedErr("");

      await logout();
      navigate("/home");
      setTimeout(() => {
        alert("User session timed out.");
      }, 1000);
      cache.userProfile && setCache((prev) => ({ ...prev, userProfile: null }));
    } catch (error) {
      setUnexpectedErr("Failed to log out.");
      console.error(error);
    }
  };

  return [handleLogout, unexpectedErr];
};

export default PostLogout;
