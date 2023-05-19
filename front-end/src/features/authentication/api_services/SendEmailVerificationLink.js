import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";

const SendEmailVerificationLink = () => {
  const [loading, toggleLoading] = useState(false);
  const [errorHandler, setErrorHandler] = useState({
    maxRequests: false,
    unexpected: false,
  });
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const handleEmailVerificationLink = async (email) => {
    toggleLoading(true);
    setErrorHandler({ unexpected: false, maxRequests: false });
    setEmailSent(false);
    const abortController = new AbortController();

    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL}/auth/api/firebase/user/emailVerification`,
        data: {
          email: email,
        },
        withCredentials: true,
        signal: abortController.signal,
        validateStatus: (status) => {
          return status === 200 || status === 429;
        },
      });
      // console.log("email res", res);

      if (res) {
        if (res.status === 200) {
          setEmailSent(true);
        } else if (
          res.status === 429 &&
          res.data.code === "auth/too-many-requests"
        ) {
          setErrorHandler({ ...errorHandler, maxRequests: true });
        }
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        console.error(error);
        setErrorHandler({ ...errorHandler, unexpected: true });
      }
    } finally {
      toggleLoading(false);
    }
  };

  return { handleEmailVerificationLink, errorHandler, loading, emailSent };
};

export default SendEmailVerificationLink;
