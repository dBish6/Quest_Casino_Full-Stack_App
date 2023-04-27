import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 } from "uuid";

// *Design Imports*
import { useToast } from "@chakra-ui/react";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

// *Utility Import*
import { storage } from "../../../utils/firebaseConfig";
// Firebase Imports...
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// NOTE: I know I could of just used the data object with axios and then
// use req.body on the back-end, but that's it now... I used query strings.
const UpdateProfile = () => {
  const [loadingUpdate, toggleLoadingUpdate] = useState({
    name: false,
    username: false,
    email: false,
    phone: false,
    profilePic: false,
    balance: false,
  });
  const [errorHandler, setErrorHandler] = useState({
    unexpected: false,
    maxRequests: false,
  });

  const toast = useToast();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser, logout, verifyEmail, balance, setBalance } = useAuth();
  const abortController = new AbortController();

  const handleFullName = async (id, name, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });

    try {
      if (currentUser.name !== name) {
        toggleLoadingUpdate({ ...loadingUpdate, name: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?name=${name}`,
          signal: abortController.signal,
          validateStatus: (status) => {
            return status === 200 || status === 429;
          },
        });
        // console.log(res.data);
        if (res) {
          if (res.status === 200) {
            setIsUpdating((prev) => ({ ...prev, name: false }));
            toast({
              description: "Real name successfully updated!",
              status: "success",
              duration: 9000,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
          } else if (
            res.status === 429 &&
            res.data.code === "auth/too-many-requests"
          ) {
            setErrorHandler({ ...errorHandler, maxRequests: true });
          }
        }
      } else {
        toast({
          description: "Given name is your current set name.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, name: false });
    }
  };

  const handleUsername = async (id, username, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });

    try {
      if (currentUser.username !== username) {
        toggleLoadingUpdate({ ...loadingUpdate, username: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?username=${username}`,
          signal: abortController.signal,
          validateStatus: (status) => {
            return status === 200 || status === 429;
          },
        });
        // console.log(res.data);
        if (res) {
          if (res.status === 200) {
            setIsUpdating((prev) => ({ ...prev, username: false }));
            toast({
              description: "Username successfully updated!",
              status: "success",
              duration: 9000,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
          } else if (
            res.status === 429 &&
            res.data.code === "auth/too-many-requests"
          ) {
            setErrorHandler({ ...errorHandler, maxRequests: true });
          }
        }
      } else {
        toast({
          description: "Given username is your current set username.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, username: false });
    }
  };

  const handleEmail = async (id, email, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });

    try {
      if (currentUser.email !== email) {
        toggleLoadingUpdate({ ...loadingUpdate, email: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?email=${email}`,
          signal: abortController.signal,
          validateStatus: (status) => {
            return status === 200 || status === 400 || status === 429;
          },
        });
        // console.log(res.data);
        if (res) {
          if (res && res.status === 200) {
            setIsUpdating((prev) => ({ ...prev, email: false }));
            toast({
              description:
                "Email successfully updated, you must now log in again.",
              status: "success",
              duration: 9000,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
            new Promise((resolve) => {
              resolve(navigate("/home"));
            }).then(() => logout());
          } else if (
            res.status === 400 &&
            res.data.code === "auth/email-already-exists"
          ) {
            toast({
              description: "Email is already being used by a Quest user.",
              status: "error",
              duration: 9000,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
          } else if (
            res.status === 429 &&
            res.data.code === "auth/too-many-requests"
          ) {
            setErrorHandler({ ...errorHandler, maxRequests: true });
          }
        }
      } else {
        toast({
          description: "Given email is your current set email.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, email: false });
    }
  };

  const handleEmailVerified = async () => {
    setEmailSent(false);
    setErrorHandler({ ...errorHandler, maxRequests: false });
    try {
      await verifyEmail();
      setEmailSent(true);
    } catch (error) {
      if (error.code === "auth/too-many-requests")
        setErrorHandler({ ...errorHandler, maxRequests: true });
      console.error(error);
    }
  };

  const handlePhone = async (id, callingCode, phoneNum, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });

    try {
      const phoneNumUpdate = callingCode + phoneNum.replace(/[()\-\s]/g, "");
      if (currentUser.phoneNumber !== phoneNumUpdate) {
        toggleLoadingUpdate({ ...loadingUpdate, phone: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?phoneNum=${encodeURIComponent(
            phoneNumUpdate
          )}`,
          signal: abortController.signal,
          validateStatus: (status) => {
            return status === 200 || status === 400 || status === 429;
          },
        });
        // console.log(res.data);
        if (res) {
          if (res.status === 200) {
            setIsUpdating((prev) => ({ ...prev, phone: false }));
            toast({
              description: "Phone number successfully updated!",
              status: "success",
              duration: 9000,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
          } else if (
            res.status === 400 &&
            res.data.code === "auth/phone-number-already-exists"
          ) {
            toast({
              description:
                "Phone number is already being used by a Quest user.",
              status: "error",
              duration: 9000,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
          } else if (
            res.status === 429 &&
            res.data.code === "auth/too-many-requests"
          ) {
            setErrorHandler({ ...errorHandler, maxRequests: true });
          }
        }
      } else {
        toast({
          description: "Given Phone number is your current set number.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, phone: false });
    }
  };

  const handleProfilePicture = async (
    id,
    photoURL,
    setSelectedPicture,
    custom,
    show,
    setShow
  ) => {
    setErrorHandler({ unexpected: false, maxRequests: false });
    toggleLoadingUpdate({ ...loadingUpdate, profilePic: true });

    try {
      // If the user passes a custom image.
      if (custom) {
        // console.log("files", photoURL.target.files[0]);
        // console.log("event", photoURL.target.value);
        const file = photoURL.target.files[0];

        if (
          file.type.substring(0, 5) === "image" &&
          /\.(jpe?g|png)$/i.test(file.name)
        ) {
          const imageRef = ref(
            storage,
            `images/userProfilePics/${file.name}_${v4()}`
          );
          await uploadBytes(imageRef, file);
          const downloadURL = await getDownloadURL(imageRef);
          const encodedURL = encodeURIComponent(downloadURL);

          const res = await axios({
            method: "PATCH",
            url: `http://localhost:4000/auth/api/firebase/update/${id}?profilePic=${encodedURL}`,
            signal: abortController.signal,
            validateStatus: (status) => {
              return status === 200 || status === 429;
            },
          });
          // console.log(res.data);
          if (res) {
            if (res.status === 200) {
              setSelectedPicture(downloadURL.toString());
              toast({
                description: "Profile picture successfully updated!",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top",
                variant: "solid",
              });
            } else if (
              res.status === 429 &&
              res.data.code === "auth/too-many-requests"
            ) {
              setErrorHandler({ ...errorHandler, maxRequests: true });
            }
          }
        } else {
          toast({
            description: "Provided invalid image.",
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
        }

        // If the user use one of the default images.
      } else {
        const encodedURL = encodeURIComponent(photoURL);
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?profilePic=${encodedURL}`,
          signal: abortController.signal,
          validateStatus: (status) => {
            return status === 200 || status === 429;
          },
        });
        // console.log(res.data);
        if (res) {
          if (res.status === 200) {
            setSelectedPicture(photoURL);
            toast({
              description: "Profile picture successfully updated!",
              status: "success",
              duration: 9000,
              isClosable: true,
              position: "top",
              variant: "solid",
            });
            setShow({ ...show, areYouSure: false });
          } else if (
            res.status === 429 &&
            res.data.code === "auth/too-many-requests"
          ) {
            setErrorHandler({ ...errorHandler, maxRequests: true });
          }
        }
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, profilePic: false });
    }
  };

  const handleUpdateBalance = async (formRef, id, deposit) => {
    setErrorHandler({ ...errorHandler, unexpected: false });
    toggleLoadingUpdate({ ...loadingUpdate, balance: true });

    try {
      const res = await axios({
        method: "PATCH",
        url: `http://localhost:4000/auth/api/firebase/update/${id}?deposit=${deposit}`,
        signal: abortController.signal,
      });
      // console.log(res.data);
      if (res && res.status === 200) {
        formRef.current.reset();
        toast({
          description: "Funds successfully added.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
        setBalance(balance + parseInt(deposit));
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, balance: false });
    }
  };

  return {
    handleFullName,
    handleUsername,
    handleEmail,
    handleEmailVerified,
    handlePhone,
    handleProfilePicture,
    handleUpdateBalance,
    emailSent,
    loadingUpdate,
    errorHandler,
  };
};

export default UpdateProfile;
