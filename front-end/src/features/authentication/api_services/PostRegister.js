import { useState } from "react";
import axios from "axios";
import apiURL from "../../../apiUrl";

// *Design Imports*
import { useToast } from "@chakra-ui/react";

const PostRegister = () => {
  const [loading, toggleLoading] = useState(false);
  const [errorHandler, setErrorHandler] = useState({
    confirmation: false,
    emailInUse: false,
    usernameInUse: "",
    phoneInUse: false,
    maxRequests: false,
    unexpected: false,
  });
  const toast = useToast();

  const abortController = new AbortController();

  const handleRegister = async (
    formRef,
    type,
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    callingCode,
    phoneNum,
    setPasswordStrength
  ) => {
    setErrorHandler({
      confirmation: false,
      emailInUse: false,
      usernameInUse: "",
      phoneInUse: false,
      maxRequests: false,
      unexpected: false,
    });

    if (password !== confirmPassword)
      return setErrorHandler({ ...errorHandler, confirmation: true });

    toggleLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: `${apiURL}/auth/api/firebase/register`,
        data: {
          type: type,
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
          phoneNum: callingCode + phoneNum.replace(/[()\-\s]/g, ""),
        },
        signal: abortController.signal,
        validateStatus: (status) => {
          return status === 200 || status === 400 || status === 429;
        },
      });
      // console.log(res);
      if (res) {
        if (res.status === 200 && res.data.registered) {
          formRef.current.reset();
          setPasswordStrength(0);
          toast({
            description:
              "Account was created successfully, you can now proceed to log in.",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
        } else if (
          res.status === 400 &&
          res.data.code === "auth/email-already-exists"
        ) {
          setErrorHandler({ ...errorHandler, emailInUse: true });
        } else if (
          res.status === 400 &&
          res.data.ERROR === "Username is already taken."
        ) {
          setErrorHandler({ ...errorHandler, usernameInUse: res.data.ERROR });
        } else if (
          res.status === 400 &&
          res.data.code === "auth/phone-number-already-exists"
        ) {
          setErrorHandler({ ...errorHandler, phoneInUse: true });
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
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoading(false);
    }
  };

  return { handleRegister, errorHandler, setErrorHandler, loading };
};

export default PostRegister;
