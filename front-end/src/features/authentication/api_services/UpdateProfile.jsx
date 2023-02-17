import { useState, useEffect } from "react";
import axios from "axios";

// *Design Imports*
import { useToast } from "@chakra-ui/react";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

const UpdateProfile = () => {
  const [successfulPost, setSuccessfulPost] = useState({
    email_: false,
    password_: false,
    phone_: false,
    balance_: false,
    loading: false,
  });
  const [errorHandler, setErrorHandler] = useState({
    badRequest: false,
    unexpected: false,
    maxRequests: false,
  });

  const toast = useToast();
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser, verifyEmail } = useAuth();

  const handleEmail = async (id, email) => {
    setSuccessfulPost({ email_: false, loading: true });
    setErrorHandler({ badRequest: false, unexpected: false });

    try {
      if (!currentUser.email === email) {
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?email=${email}`,
        });
        console.log(res.data);
        if (res && res.status === 200)
          setSuccessfulPost({ email_: true, loading: false });
      } else {
        setErrorHandler({ badRequest: true });
      }
    } catch (error) {
      setErrorHandler({ unexpected: true });
      console.error(error);
    }
  };

  const handleEmailVerified = async () => {
    setEmailSent(false);
    setErrorHandler({ maxRequests: false });
    try {
      const authEmailVerification = await verifyEmail();
      console.log(authEmailVerification);
      if (authEmailVerification) setEmailSent(true);
      console.log(emailSent);
    } catch (error) {
      if (error.code === "auth/too-many-requests")
        setErrorHandler({ maxRequests: true });
      console.error(error);
    }
  };

  // const handlePhone = async (phoneNum) => {
  //   try {
  //     setSuccessfulPost({ phone_: false, loading: true });
  //     setUnexpectedErr("");

  //     const res = await updatePhoneNumber(phoneNum);
  //     if (res) setSuccessfulPost({ phone_: true, loading: false });
  //   } catch (error) {
  //     setUnexpectedErr("Failed to update profile.");
  //     console.error(error);
  //   }
  // };

  const handleUpdateWins = async (id, wins) => {
    setErrorHandler({ unexpected: false });

    try {
      const res = await axios({
        method: "PATCH",
        url: `http://localhost:4000/auth/api/firebase/update/${id}?wins=${wins}`,
      });
      if (res && res.status === 200) console.log(res.data);
    } catch (error) {
      setErrorHandler({ unexpected: true });
      console.error(error);
    }
  };

  const handleUpdateBalance = async (formRef, id, balance) => {
    setSuccessfulPost({ balance_: false, loading: true });
    setErrorHandler({ unexpected: false });

    try {
      const res = await axios({
        method: "PATCH",
        url: `http://localhost:4000/auth/api/firebase/update/${id}?balance=${balance}`,
      });
      console.log(res.data);
      if (res && res.status === 200)
        setSuccessfulPost({ balance_: true, loading: false });
      formRef.current.reset();
      if (successfulPost.balance_)
        toast({
          description: "Funds successfully added.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
    } catch (error) {
      setErrorHandler({ unexpected: true });
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (
  //     successfulPost.email_ ||
  //     successfulPost.password_ ||
  //     successfulPost.phone_
  //   ) {
  //     setSuccessMsg("Successfully updated!");
  //   }
  // }, [successfulPost]);

  return {
    handleEmail,
    handleEmailVerified,
    // handlePhone,
    handleUpdateWins,
    handleUpdateBalance,
    emailSent,
    successfulPost,
    errorHandler,
  };
};

export default UpdateProfile;
