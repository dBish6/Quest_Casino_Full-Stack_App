import { useState } from "react";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

// *Design Imports*
import { useToast } from "@chakra-ui/react";

const PostResetPassword = () => {
  const [loading, toggleLoading] = useState(false);
  const [errorHandler, setErrorHandler] = useState({
    notFound: false,
    unexpected: false,
  });
  const toast = useToast();
  const { resetPassword } = useAuth();

  const handleReset = async (formRef, email) => {
    toggleLoading(true);
    setErrorHandler({ notFound: false, unexpected: false });

    try {
      await resetPassword(email);
      formRef.current.reset();
      toast({
        description: "Check your email inbox for further instructions.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrorHandler({ ...errorHandler, notFound: true });
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
      }
      console.error(error);
    } finally {
      toggleLoading(false);
    }
  };

  return { handleReset, errorHandler, loading };
};

export default PostResetPassword;
