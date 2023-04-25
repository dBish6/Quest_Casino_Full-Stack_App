/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const GetUserBalanceCompletedQuests = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const abortController = new AbortController();

  const fetchBalanceAndCompletedQuests = async (
    id,
    setBalance,
    setCompletedQuests
  ) => {
    try {
      const res = await axios({
        method: "GET",
        url: `http://localhost:4000/auth/api/firebase/users/${id}?balance=${true}&completedQuests=${true}`,
        signal: abortController.signal,
        validateStatus: (status) => {
          return status === 200 || status === 404; // Resolve only if the status code is 404 or 200.
        },
      });
      // console.log(res.data);
      if (res && res.status === 200) {
        setBalance(res.data.balance);
        if (res.data.completedQuests) {
          setCompletedQuests(res.data.completedQuests);
        }
      } else if (res && res.status === 404) {
        toast({
          description: `Server Error 404: balance and quests wasn't received because ${res.data.user}`,
          status: "error",
          duration: 99999999,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        console.error(error);
        navigate("/error500");
      }
    }
  };

  return {
    fetchBalanceAndCompletedQuests,
    abortController,
  };
};

export default GetUserBalanceCompletedQuests;
