import { useState, useEffect } from "react";
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

const UpdateProfile = () => {
  const [loadingUpdate, toggleLoadingUpdate] = useState({
    name: false,
    username: false,
    email: false,
    phone: false,
    profilePic: false,
    balance: false,
  });
  // const [successfulPost, setSuccessfulPost] = useState({
  //   email: false,
  //   phone: false,
  //   balance: false,
  //   loading: false,
  // });
  const [errorHandler, setErrorHandler] = useState({
    unexpected: false,
    maxRequests: false,
  });

  const toast = useToast();
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const { currentUser, logout, verifyEmail, balance, setBalance } = useAuth();

  const handleFullName = async (id, name, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });

    try {
      if (currentUser.name !== name) {
        toggleLoadingUpdate({ name: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?name=${name}`,
        });
        console.log(res.data);
        if (res && res.status === 200) {
          toggleLoadingUpdate({ name: false });
          setIsUpdating({ name: false });
          toast({
            description: "Real name successfully updated!",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
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
      if (error.code === "auth/too-many-requests") {
        setErrorHandler({ maxRequests: true });
      } else {
        setErrorHandler({ unexpected: true });
      }
      console.error(error);
    }
  };

  const handleUsername = async (id, username, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });

    try {
      if (currentUser.username !== username) {
        toggleLoadingUpdate({ username: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?username=${username}`,
        });
        console.log(res.data);
        if (res && res.status === 200) {
          toggleLoadingUpdate({ username: false });
          setIsUpdating({ username: false });
          toast({
            description: "Username successfully updated!",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
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
      if (error.code === "auth/too-many-requests") {
        setErrorHandler({ maxRequests: true });
      } else {
        setErrorHandler({ unexpected: true });
      }
      console.error(error);
    }
  };

  const handleEmail = async (id, email, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });

    try {
      if (currentUser.email !== email) {
        toggleLoadingUpdate({ email: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?email=${email}`,
        });
        console.log(res.data);
        if (res && res.status === 200) {
          toggleLoadingUpdate({ email: false });
          setIsUpdating({ email: false });
          toast({
            description:
              "Email successfully updated, you must now log in again.",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
          navigate("/home") && logout();
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
      if (error.code === "auth/email-already-in-use") {
        toast({
          description: "Email is already being used by a Quest user.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      } else if (error.code === "auth/too-many-requests") {
        setErrorHandler({ maxRequests: true });
      } else {
        setErrorHandler({ unexpected: true });
      }
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

  const handlePhone = async (id, phoneNum, setIsUpdating) => {
    setErrorHandler({ unexpected: false, maxRequests: false });
    // TODO: Change.
    const changingPhoneNum = "+1" + phoneNum;
    try {
      if (currentUser.phoneNumber !== changingPhoneNum) {
        toggleLoadingUpdate({ phone: true });
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?phoneNum=${changingPhoneNum}`,
        });
        console.log(res.data);
        if (res && res.status === 200) {
          toggleLoadingUpdate({ phone: false });
          setIsUpdating({ phone: false });
          toast({
            description: "Phone number successfully updated!",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
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
      if (error.code === "auth/phone-number-already-exists") {
        toast({
          description: "Phone number is already being used by a Quest user.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      } else if (error.code === "auth/too-many-requests") {
        setErrorHandler({ maxRequests: true });
      } else {
        setErrorHandler({ unexpected: true });
      }
      console.error(error);
    }
  };

  const handleProfilePicture = async (
    id,
    photoURL,
    setSelectedPicture,
    custom
  ) => {
    setErrorHandler({ unexpected: false, maxRequests: false });
    toggleLoadingUpdate({ profilePic: true });

    try {
      // If the user passes a custom image.
      if (custom && custom !== currentUser.photoURL) {
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
          const uploaded = await uploadBytes(imageRef, file);
          // console.log("imageRef", imageRef);

          if (uploaded) {
            const downloadURL = await getDownloadURL(imageRef);
            const encodedURL = encodeURIComponent(downloadURL);
            // console.log("encodedURL", encodedURL);

            const res = await axios({
              method: "PATCH",
              url: `http://localhost:4000/auth/api/firebase/update/${id}?profilePic=${encodedURL}`,
            });
            console.log(res.data);
            if (res && res.status === 200) {
              setSelectedPicture(downloadURL.toString());
              toast({
                description: "Profile picture successfully updated!",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top",
                variant: "solid",
              });
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
        console.log("photoURL", photoURL);
        const encodedURL = encodeURIComponent(photoURL);
        console.log("encodedURL", encodedURL);
        const res = await axios({
          method: "PATCH",
          url: `http://localhost:4000/auth/api/firebase/update/${id}?profilePic=${encodedURL}`,
        });
        console.log(res.data);

        if (res && res.status === 200) {
          setSelectedPicture(photoURL);
          toast({
            description: "Profile picture successfully updated!",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
        }
      }
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        setErrorHandler({ maxRequests: true });
      } else {
        setErrorHandler({ unexpected: true });
      }
      console.error(error);
    } finally {
      toggleLoadingUpdate({ profilePic: false });
    }
  };

  // const handleUpdateWins = async (id, wins) => {
  //   setErrorHandler({ unexpected: false, maxRequests: false });

  //   try {
  //     const res = await axios({
  //       method: "PATCH",
  //       url: `http://localhost:4000/auth/api/firebase/update/${id}?wins=${wins}`,
  //     });
  //     if (res && res.status === 200) console.log(res.data);
  //   } catch (error) {
  //     if (error.code === "auth/too-many-requests") {
  //       toast({
  //         description: "Max request exceeded! Please try again later.",
  //         status: "error",
  //         isClosable: true,
  //         position: "top",
  //         variant: "solid",
  //       });
  //     } else {
  //       toast({
  //         description: "Server Error 500: Failed to update profile.",
  //         status: "error",
  //         isClosable: true,
  //         position: "top",
  //         variant: "solid",
  //       });
  //     }
  //     console.error(error);
  //   }
  // };

  const handleUpdateBalance = async (formRef, id, deposit) => {
    setErrorHandler({ unexpected: false });
    toggleLoadingUpdate({ balance: true });
    console.log("handleUpdateBalance");

    try {
      const res = await axios({
        method: "PATCH",
        url: `http://localhost:4000/auth/api/firebase/update/${id}?balance=${deposit}`,
      });
      console.log(res.data);
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
      setErrorHandler({ unexpected: true });
      console.error(error);
    } finally {
      toggleLoadingUpdate({ balance: false });
    }
  };

  return {
    handleFullName,
    handleUsername,
    handleEmail,
    handleEmailVerified,
    handlePhone,
    handleProfilePicture,
    // handleUpdateWins,
    handleUpdateBalance,
    emailSent,
    // successfulPost,
    loadingUpdate,
    errorHandler,
  };
};

export default UpdateProfile;
