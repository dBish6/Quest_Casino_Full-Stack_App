import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

const DeleteUser = () => {
  const [loading, toggleLoading] = useState(false);
  const [unexpectedErr, setUnexpectedErr] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const abortController = new AbortController();

  const handleDeleteProfile = async (id) => {
    toggleLoading(true);
    setUnexpectedErr("");

    try {
      const res = await axios({
        method: "DELETE",
        url: `http://localhost:4000/auth/api/firebase/delete/${id}`,
        signal: abortController.signal,
      });
      // console.log(res.data);
      if (res && res.status === 200) {
        toast({
          description: "Profile successfully deleted, sad to see you go:(",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
        navigate("/home");
        logout();
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
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
