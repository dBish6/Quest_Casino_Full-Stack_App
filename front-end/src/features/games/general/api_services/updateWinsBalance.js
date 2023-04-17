import axios from "axios";

import { createStandaloneToast } from "@chakra-ui/toast";
const { toast } = createStandaloneToast();

const updateWinsBalance = async (id, win, type, balance) => {
  const abortController = new AbortController();
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://localhost:4000/auth/api/firebase/update/${id}?win=${win}&winType=${type}&balance=${balance}`,
      signal: abortController.signal,
      validateStatus: (status) => {
        return status === 200 || status === 404; // Resolve only if the status code is 404 or 200.
      },
    });
    console.log(res.data);
    if (res && res.status === 404) {
      toast({
        description: "Server Error 404: " + res.data.user,
        status: "error",
        duration: 99999999,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
    }

    return res;
  } catch (error) {
    if (error.code === "ECONNABORTED" || error.message === "canceled") {
      console.warn("Request was aborted.");
    } else {
      console.error(error);
      toast({
        description:
          "Server Error 500: Failed to update user wins and balance.",
        status: "error",
        duration: 99999999,
        isClosable: true,
        position: "top",
        variant: "solid",
      });
    }
    abortController.abort();
  }
};

export default updateWinsBalance;
