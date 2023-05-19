import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

// *Design Import*
import { useToast } from "@chakra-ui/react";

const PostLogin = () => {
  const [loading, toggleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorHandler, setErrorHandler] = useState({
    badRequest: false,
    notFound: false,
    maxRequests: false,
    unexpected: false,
  });
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, login, logout, setCurrentUser, setCsrfToken } =
    useAuth();

  const handleLogin = async (formRef, email, password) => {
    toggleLoading(true);
    setErrorHandler({
      badRequest: false,
      notFound: false,
      maxRequests: false,
      unexpected: false,
    });
    let loginRes;
    const abortController = new AbortController();

    if (currentUser !== null) {
      formRef && formRef.current.reset();
      return toast({
        description: "You are already logged in.",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
    }
    try {
      loginRes = await login(email, password);

      if (loginRes) {
        const idToken = await loginRes.user.getIdToken();
        // Then verifies JWT token and creates session cookie and CSRF cookie by request.
        const serverRes = await axios({
          method: "POST",
          url: `${apiURL}/auth/api/firebase/login`,
          headers: {
            Authorization: idToken,
          },
          withCredentials: true,
          signal: abortController.signal,
        });
        // console.log("serverRes", serverRes.data);

        if (serverRes && serverRes.status === 200) {
          setCurrentUser(serverRes.data.user);
          setCsrfToken(serverRes.data.token);
          setSuccessMsg("Welcome back!");
          formRef.current.reset();
          setTimeout(() => {
            setSuccessMsg("");
          }, 15000);
        }
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorHandler({ ...errorHandler, badRequest: true });
      } else if (error.code === "auth/user-not-found") {
        setErrorHandler({ ...errorHandler, notFound: true });
      } else if (error.code === "auth/too-many-requests") {
        setErrorHandler({ ...errorHandler, maxRequests: true });
      } else if (error.response && error.response.status === 401) {
        navigate("/error401");
      } else if (
        error.code === "ECONNABORTED" ||
        error.message === "canceled"
      ) {
        console.warn("Request was aborted.");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      loginRes && (await logout());
    } finally {
      toggleLoading(false);
    }
  };

  return { handleLogin, errorHandler, successMsg, loading };
};

export default PostLogin;
