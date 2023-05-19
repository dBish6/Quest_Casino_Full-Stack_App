import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

const PostGoogleRegister = () => {
  const [googleLoading, toggleLoading] = useState(false);
  const [googleSuccessMsg, setGoogleSuccessMsg] = useState("");
  const [googleUnexpectedErr, setUnexpectedErr] = useState("");
  const navigate = useNavigate();
  const { signInWithGoogle, logout, setCurrentUser, setCsrfToken } = useAuth();

  const abortController = new AbortController();

  const handleGoogleRegister = async () => {
    toggleLoading(true);
    setGoogleSuccessMsg("");
    setUnexpectedErr("");
    let sessionRes;

    try {
      const signInRes = await signInWithGoogle();
      // console.log("signInRes", signInRes);
      const idToken = await signInRes.user.getIdToken();
      if (signInRes) {
        const substrings = signInRes.user.displayName.split(" ");
        const regRes = await axios({
          method: "POST",
          url: `${apiURL}/auth/api/firebase/register`,
          data: {
            userId: signInRes.user.uid,
            type: "Google",
            firstName: substrings[0],
            lastName: substrings[1],
            username: signInRes.user.displayName,
            email: signInRes.user.email,
            password: null,
            phoneNum: signInRes.user.phoneNumber,
            profilePic: signInRes.user.photoURL,
          },
          signal: abortController.signal,
          validateStatus: (status) => {
            return status === 200 || status === 202;
          },
        });
        // console.log("regRes", regRes.data);

        if (regRes && regRes.status === 202 && regRes.data.registered) {
          sessionRes = await axios({
            method: "POST",
            url: `${apiURL}/auth/api/firebase/login`,
            headers: {
              Authorization: idToken,
            },
            withCredentials: true,
            signal: abortController.signal,
          });
          // console.log("sessionRes", sessionRes.data);
          if (sessionRes && sessionRes.status === 200) {
            setCurrentUser(sessionRes.data.user);
            setCsrfToken(sessionRes.data.token);
            setGoogleSuccessMsg("Welcome back!");
            setTimeout(() => {
              setGoogleSuccessMsg("");
            }, 15000);
          }
        } else if (regRes && regRes.status === 200 && regRes.data.registered) {
          navigate("/home");
          setGoogleSuccessMsg(
            "Google account successfully registered! Since it was the first login, to proceed, log in with google again."
          );
          setTimeout(() => {
            setGoogleSuccessMsg("");
          }, 27000);
        }
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        setUnexpectedErr("Failed to sign in with Google.");
        console.error(error);
      }
      abortController.abort();

      sessionRes && (await logout());
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
