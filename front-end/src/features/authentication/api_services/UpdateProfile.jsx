import { useState, useEffect } from "react";
import axios from "axios";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

// *API Services Imports*
// import GetUser from "./GetUser";

const UpdateProfile = () => {
  // const [fsUser, notFoundErr, loading] = GetUser(currentUser.uid);

  const [successfulPost, setSuccessfulPost] = useState({
    email_: false,
    password_: false,
    phone_: false,
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorHandler, setErrorHandler] = useState({
    badRequest: false,
    unexpected: false,
    maxRequests: false,
  });

  const [emailSent, setEmailSent] = useState(false);
  const { currentUser, verifyEmail } = useAuth();

  const handleEmail = async (id, email) => {
    try {
      setSuccessfulPost({ email_: false });
      setErrorHandler({ badRequest: false, unexpected: false });

      if (!currentUser.email === email) {
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?email=${email}`,
        });
        console.log(res.data);
        if (res && res.status === 200) setSuccessfulPost({ email_: true });
      } else {
        setErrorHandler({ badRequest: true });
      }
    } catch (error) {
      setErrorHandler({ unexpected: true });
      console.error(error);
    }
  };

  // const handlePhone = async (phoneNum) => {
  //   try {
  //     setSuccessfulPost({ phone_: false });
  //     setUnexpectedErr("");

  //     const res = await updatePhoneNumber(phoneNum);
  //     if (res) setSuccessfulPost({ phone_: true });
  //   } catch (error) {
  //     setUnexpectedErr("Failed to update profile.");
  //     console.error(error);
  //   }
  // };

  const handleEmailVerified = async () => {
    setEmailSent(false);
    setErrorHandler({ maxRequests: false });
    try {
      const authEmailVerification = await verifyEmail();
      if (authEmailVerification) setEmailSent(true);
      console.log(emailSent);
    } catch (error) {
      if (error.code === "auth/too-many-requests")
        setErrorHandler({ maxRequests: true });
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      successfulPost.email_ ||
      successfulPost.password_ ||
      successfulPost.phone_
    ) {
      setSuccessMsg("Successfully updated!");
    }
  }, [successfulPost]);

  return {
    handleEmail,
    // handlePhone,
    handleEmailVerified,
    emailSent,
    successMsg,
    errorHandler,
  };
};

export default UpdateProfile;
