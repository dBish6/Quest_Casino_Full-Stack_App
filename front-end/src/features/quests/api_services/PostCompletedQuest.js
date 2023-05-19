/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";
import { useToast } from "@chakra-ui/react";

const PostCompletedQuest = () => {
  const [loading, toggleLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const abortController = new AbortController();

  const handleCompletedQuest = async (
    id,
    quest,
    balance,
    reward,
    csrfToken
  ) => {
    toggleLoading(true);
    try {
      const res = await axios({
        method: "PATCH",
        url: `${apiURL}/auth/api/firebase/update/${id}?completedQuest=${quest}`,
        data: {
          balance: balance,
          reward: reward,
        },
        headers: {
          CSRF_Token: csrfToken,
        },
        withCredentials: true,
        signal: abortController.signal,
      });
      // console.log("questRes", res.data);
      if (res && res.status === 200) {
        toast({
          description: `"${quest}" quest was just completed, you just earned a $${reward} reward!`,
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
        return res.data;
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else if (error.response && error.response.status === 401) {
        console.error(error);
        navigate("/error401");
      } else {
        console.error(error);
        toast({
          description: `Server Error 500: Unexpectedly, a completed quest failed to send to the server!`,
          status: "error",
          duration: 99999999,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } finally {
      toggleLoading(false);
    }
  };

  return { handleCompletedQuest, loading, abortController };
};

export default PostCompletedQuest;
