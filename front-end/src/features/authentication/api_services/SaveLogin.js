import { useState } from "react";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

// *Design Imports*
import { useToast } from "@chakra-ui/react";

const SaveLogin = () => {
  const [loading, toggleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorHandler, setErrorHandler] = useState({
    badRequest: false,
    notFound: false,
    maxRequests: false,
    unexpected: false,
  });
  const toast = useToast();
  const { currentUser, login } = useAuth();

  const handleLogin = async (formRef, email, password) => {
    let timeout;
    toggleLoading(true);
    setErrorHandler({
      badRequest: false,
      notFound: false,
      unexpected: false,
    });

    if (currentUser !== null) {
      formRef.current.reset();
      toast({
        description: "You are already logged in.",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
      return;
    }
    try {
      const res = await login(email, password);
      console.log(res);
      if (res) {
        setSuccessMsg("Welcome back!");
        formRef.current.reset();
        timeout = setTimeout(() => {
          setSuccessMsg("");
        }, 15000);
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorHandler({ badRequest: true });
      } else if (error.code === "auth/user-not-found") {
        setErrorHandler({ notFound: true });
      } else if (error.code === "auth/too-many-requests") {
        setErrorHandler({ maxRequests: true });
      } else {
        setErrorHandler({
          unexpected: true,
        });
      }
      console.error(error);
    } finally {
      toggleLoading(false);
    }

    return () => clearTimeout(timeout);
  };

  return { handleLogin, errorHandler, successMsg, loading };
};

export default SaveLogin;
