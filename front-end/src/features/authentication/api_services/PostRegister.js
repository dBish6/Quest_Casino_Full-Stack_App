import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// *Design Imports*
import { useToast } from "@chakra-ui/react";

const PostRegister = () => {
  const [loading, toggleLoading] = useState(false);
  const [errorHandler, setErrorHandler] = useState({
    confirmation: false,
    emailInUse: false,
    phoneInUse: false,
    maxRequests: false,
    unexpected: false,
  });
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (
    formRef,
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
    phoneNum
  ) => {
    setErrorHandler({
      confirmation: false,
      emailInUse: false,
      phoneInUse: false,
      maxRequests: false,
      unexpected: false,
    });

    if (password !== confirmPassword)
      return setErrorHandler({ confirmation: true });

    toggleLoading(true);
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:4000/auth/api/firebase/register",
        data: {
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password,
          phoneNum: phoneNum,
          profilePic: "https://i.ibb.co/YXgGLwq/profile-stock.png",
        },
      });
      console.log(res.data);
      if (res && res.status === 200) {
        formRef.current.reset();
        navigate("/home");
        toast({
          description:
            "Account was created successfully, you can now proceed to log in.",
          status: "info",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorHandler({ emailInUse: true });
      } else if (error.code === "auth/phone-number-already-exists") {
        setErrorHandler({ phoneInUse: true });
      } else if (error.code === "auth/too-many-requests") {
        setErrorHandler({ maxRequests: true });
      } else {
        setErrorHandler({ unexpected: true });
      }
      console.error(error);
    } finally {
      toggleLoading(false);
    }
  };

  return { handleRegister, errorHandler, setErrorHandler, loading };
};

export default PostRegister;
