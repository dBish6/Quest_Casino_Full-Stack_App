import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

const PostGoogleRegister = () => {
  const [googleLoading, toggleLoading] = useState(true);
  const [googleSuccessMsg, setGoogleSuccessMsg] = useState("");
  const [googleUnexpectedErr, setUnexpectedErr] = useState("");
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleGoogleRegister = async () => {
    toggleLoading(true);
    setGoogleSuccessMsg("");
    setUnexpectedErr("");

    try {
      const signInRes = await signInWithGoogle();

      if (signInRes) {
        const substrings = signInRes.user.displayName.split(" ");
        const serverRes = await axios({
          method: "POST",
          url: "http://localhost:4000/auth/api/firebase/googleRegister",
          data: {
            userId: signInRes.user.uid,
            firstName: substrings[0],
            lastName: substrings[1],
            username: signInRes.user.displayName,
            email: signInRes.user.email,
            password: null,
            phoneNum: signInRes.user.phoneNumber,
            profilePic: signInRes.user.photoURL,
          },
        });
        console.log(serverRes.data);
        if (serverRes.data.registered) {
          setGoogleSuccessMsg("Welcome back!");
        } else if (serverRes) {
          navigate("/home");
          // console.warn = () => {};
          setGoogleSuccessMsg("Google account successfully registered.");
          setTimeout(() => {
            setGoogleSuccessMsg("");
          }, 15000);
        }
      }
    } catch (error) {
      setUnexpectedErr("Failed to sign in with Google.");
      console.error(error);
    } finally {
      toggleLoading(false);
    }
  };

  return {
    handleGoogleRegister,
    googleSuccessMsg,
    googleUnexpectedErr,
    googleLoading,
  };
};

export default PostGoogleRegister;
