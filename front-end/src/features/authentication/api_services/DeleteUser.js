import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";
import { useToast } from "@chakra-ui/react";

const DeleteUser = (logout, id, csrfToken) => {
  const [loading, toggleLoading] = useState(false);
  const [unexpectedErr, setUnexpectedErr] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const abortController = new AbortController();

  const handleDeleteProfile = async () => {
    toggleLoading(true);
    setUnexpectedErr("");

    try {
      const res = await axios({
        method: "DELETE",
        url: `${apiURL}/auth/api/firebase/delete/${id}`,
        headers: {
          CSRF_Token: csrfToken,
        },
        withCredentials: true,
        signal: abortController.signal,
      });
      // console.log(res.data);
      if (res && res.status === 200) {
        await new Promise((resolve) => {
          resolve(navigate("/home"));
        });
        await logout();
        toast({
          description: "Profile successfully deleted, sad to see you go:(",
          status: "success",
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
        setUnexpectedErr("Failed to delete profile.");
        console.error(error);
      }
      abortController.abort();
    } finally {
      toggleLoading(false);
    }
  };

  return { handleDeleteProfile, unexpectedErr, loading };
};

export default DeleteUser;
