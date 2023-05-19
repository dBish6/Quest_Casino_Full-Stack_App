import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";
import { useToast } from "@chakra-ui/react";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

const PostLogout = () => {
  const [loading, toggleLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleUserLogout = async (sendDefaultMsg, atError401) => {
    const abortController = new AbortController();

    try {
      toggleLoading(true);
      // To verify and clear session cookie.
      const serverRes = await axios({
        method: "POST",
        url: `${apiURL}/auth/api/firebase/logout`,
        withCredentials: true,
        signal: abortController.signal,
      });
      // console.log("serverRes", serverRes);

      if (serverRes && serverRes.status === 200) {
        !atError401 &&
          (await new Promise((resolve) => {
            resolve(navigate("/home"));
          }));
        await logout();
        if (sendDefaultMsg) {
          // Default
          alert("User session timed out.");
        } else if (atError401) {
          // Unauthorized
          alert("You were logged out due to a unauthorized server request.");
        } else {
          // No Msg
          return true;
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(error);
        !atError401 && navigate("/error401");
      } else if (
        error.code === "ECONNABORTED" ||
        error.message === "canceled"
      ) {
        console.warn("Request was aborted.");
      } else {
        console.error(error);
        toast({
          description: "Server Error 500: Failed to log out.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } finally {
      toggleLoading(false);
    }
  };

  return [handleUserLogout, loading];
};

export default PostLogout;
