import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";
import { nanoid } from "nanoid";

// *Design Import*
import { useToast } from "@chakra-ui/react";

// *Utility Import*
import { storage } from "../../../utils/firebaseConfig";
// Firebase Imports...
import {
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// *API Services Import*
import PostLogout from "../api_services/PostLogout";

const UpdateProfile = (currentUser, csrfToken) => {
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
  });

  const toast = useToast();
  const navigate = useNavigate();
  const [handleUserLogout, logoutLoading] = PostLogout();

  const abortController = new AbortController();

  const handleFullName = async (name, setIsUpdating) => {
    setErrorHandler({ unexpected: false });

    try {
      if (currentUser.name !== name) {
        toggleLoadingUpdate({ ...loadingUpdate, name: true });

        const res = await axios({
          method: "PATCH",
          url: `${apiURL}/auth/api/firebase/update/${currentUser.uid}`,
          data: {
            name: name,
          },
          headers: {
            CSRF_Token: csrfToken,
          },
          withCredentials: true,
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
          } else if (res.status === 429) {
            navigate("/error429");
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
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, name: false });
    }
  };

  const handleUsername = async (username, setIsUpdating) => {
    setErrorHandler({ unexpected: false });

    try {
      if (currentUser.username !== username) {
        toggleLoadingUpdate({ ...loadingUpdate, username: true });
        const res = await axios({
          method: "PATCH",
          url: `${apiURL}/auth/api/firebase/update/${currentUser.uid}`,
          data: {
            username: username,
          },
          headers: {
            CSRF_Token: csrfToken,
          },
          withCredentials: true,
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
          } else if (res.status === 429) {
            navigate("/error429");
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
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, username: false });
    }
  };

  const handleEmail = async (email, setIsUpdating) => {
    setErrorHandler({ unexpected: false });

    try {
      if (currentUser.email !== email) {
        toggleLoadingUpdate({ ...loadingUpdate, email: true });
        const res = await axios({
          method: "PATCH",
          url: `${apiURL}/auth/api/firebase/update/${currentUser.uid}`,
          data: {
            email: email,
          },
          headers: {
            CSRF_Token: csrfToken,
          },
          withCredentials: true,
          signal: abortController.signal,
          validateStatus: (status) => {
            return status === 200 || status === 400 || status === 429;
          },
        });
        // console.log(res.data);
        if (res) {
          if (res && res.status === 200) {
            setIsUpdating((prev) => ({ ...prev, email: false }));
            const logoutRes = await handleUserLogout();
            if (logoutRes && !logoutLoading) {
              toast({
                description:
                  "Email successfully updated, you must now log in again.",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "top",
                variant: "solid",
              });
            }
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
          } else if (res.status === 429) {
            navigate("/error429");
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
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, email: false });
    }
  };

  const handlePhone = async (callingCode, phoneNum, setIsUpdating) => {
    setErrorHandler({ unexpected: false });

    try {
      const phoneNumUpdate = callingCode + phoneNum.replace(/[()\-\s]/g, "");
      if (currentUser.phoneNumber !== phoneNumUpdate) {
        toggleLoadingUpdate({ ...loadingUpdate, phone: true });
        const res = await axios({
          method: "PATCH",
          url: `${apiURL}/auth/api/firebase/update/${currentUser.uid}`,
          data: {
            phoneNum: phoneNumUpdate,
          },
          headers: {
            CSRF_Token: csrfToken,
          },
          withCredentials: true,
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
          } else if (res.status === 429) {
            navigate("/error429");
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
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, phone: false });
    }
  };

  const handleProfilePicture = async (
    photoURL,
    setSelectedPicture,
    custom,
    show,
    setShow
  ) => {
    setErrorHandler({ unexpected: false });
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
          const currentImage = await listAll(
              ref(storage, `images/userProfilePics/${currentUser.uid}/`)
            ),
            newImageRef = ref(
              storage,
              `images/userProfilePics/${currentUser.uid}/${
                file.name
              }_${nanoid()}`
            );
          // If there is not a item in storage, just upload the new image. Else delete it and then upload.
          if (!currentImage.items.length) {
            await uploadBytes(newImageRef, file);
          } else {
            for (const item of currentImage.items) {
              // There can only be one item in storage, but this is just in case.
              await deleteObject(ref(storage, item.fullPath));
            }
            await uploadBytes(newImageRef, file);
          }
          const downloadURL = await getDownloadURL(newImageRef);

          const res = await axios({
            method: "PATCH",
            url: `${apiURL}/auth/api/firebase/update/${currentUser.uid}`,
            data: {
              profilePic: downloadURL,
            },
            headers: {
              CSRF_Token: csrfToken,
            },
            withCredentials: true,
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
            } else if (res.status === 429) {
              navigate("/error429");
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

        // If the user uses one of the default images.
      } else {
        const res = await axios({
          method: "PATCH",
          url: `${apiURL}/auth/api/firebase/update/${currentUser.uid}`,
          data: {
            profilePic: photoURL,
          },
          headers: {
            CSRF_Token: csrfToken,
          },
          withCredentials: true,
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
          } else if (res.status === 429) {
            navigate("/error429");
          }
        }
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, profilePic: false });
    }
  };

  const handleUpdateBalance = async (
    formRef,
    id,
    deposit,
    setCache,
    csrfToken
  ) => {
    setErrorHandler({ ...errorHandler, unexpected: false });
    toggleLoadingUpdate({ ...loadingUpdate, balance: true });

    try {
      const res = await axios({
        method: "PATCH",
        url: `${apiURL}/auth/api/firebase/update/${id}`,
        data: {
          deposit: deposit,
        },
        headers: {
          CSRF_Token: csrfToken,
        },
        withCredentials: true,
        signal: abortController.signal,
        validateStatus: (status) => {
          return status === 200 || status === 429;
        },
      });
      // console.log(res.data);
      if (res) {
        if (res.status === 200) {
          formRef.current.reset();
          toast({
            description: "Funds successfully added.",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
            variant: "solid",
          });
          setCache((prev) => ({
            ...prev,
            userProfile: {
              ...prev.userProfile,
              balance: prev.userProfile.balance + parseInt(deposit),
            },
          }));
        } else if (res.status === 429) {
          navigate("error429");
        }
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        setErrorHandler({ ...errorHandler, unexpected: true });
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoadingUpdate({ ...loadingUpdate, balance: false });
    }
  };

  return {
    handleFullName,
    handleUsername,
    handleEmail,
    handlePhone,
    handleProfilePicture,
    handleUpdateBalance,
    loadingUpdate,
    errorHandler,
  };
};

export default UpdateProfile;
