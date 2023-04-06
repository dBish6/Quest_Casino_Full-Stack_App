/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const PostCompletedQuest = (id) => {
  const [loading, toggleLoading] = useState(false);
  const toast = useToast();

  const abortController = new AbortController();

  const handleCompletedQuest = async (quest, balance, reward) => {
    toggleLoading(true);
    try {
      const res = await axios({
        method: "PATCH",
        url: `http://localhost:4000/auth/api/firebase/update/${id}?completedQuest=${quest}&balance=${balance}&reward=${reward}`,
        signal: abortController.signal,
      });
      console.log("questRes", res.data);
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
