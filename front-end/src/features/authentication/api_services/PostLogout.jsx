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

      const res = await logout();
      if (res) {
        navigate("/home");
        document.location.pathname === "/home" &&
          alert("User session timed out.");
      }
    } catch (error) {
      setUnexpectedErr("Failed to log out.");
      console.error(error);
    }
  };

  return [handleLogout, unexpectedErr];
};

export default PostLogout;
