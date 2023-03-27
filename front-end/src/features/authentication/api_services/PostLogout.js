import { useState } from "react";
import { useNavigate } from "react-router-dom";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

const PostLogout = () => {
  const [unexpectedErr, setUnexpectedErr] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setUnexpectedErr("");

      await logout();
      navigate("/home");
      setTimeout(() => {
        alert("User session timed out.");
      }, 1000);
    } catch (error) {
      setUnexpectedErr("Failed to log out.");
      console.error(error);
    }
  };

  return [handleLogout, unexpectedErr];
};

export default PostLogout;
