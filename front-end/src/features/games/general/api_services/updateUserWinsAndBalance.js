import axios from "axios";
import apiURL from "../../../../apiUrl";

import { createStandaloneToast } from "@chakra-ui/toast";
const { toast } = createStandaloneToast();

const updateUserWinsAndBalance = async (id, win, game, balance, csrfToken) => {
  const abortController = new AbortController();
  try {
    const res = await axios({
      method: "PATCH",
      url: `${apiURL}/auth/api/firebase/update/${id}?win=${win}&game=${game}`,
      data: {
        balance: balance,
      },
      headers: {
        CSRF_Token: csrfToken,
      },
      withCredentials: true,
      signal: abortController.signal,
      validateStatus: (status) => {
        return status === 200 || status === 404; // Resolve only if the status code is 404 or 200.
      },
    });
    // console.log(res.data);
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
  } catch (error) {
    if (error.code === "ECONNABORTED" || error.message === "canceled") {
      console.warn("Request was aborted.");
    } else if (error.response && error.response.status === 401) {
      console.error(error);
      const pathname =
        window.location.hostname === "localhost"
          ? `${window.location.hostname}:3000/error401`
          : `${window.location.hostname}/error401`;
      window.location = `${window.location.protocol}//${pathname}`;
    } else {
      console.error(error);
      toast({
        description:
          "Server Error 500: Failed to update user wins and balance. If the issue persists, please contact support for further assistance.",
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

export default updateUserWinsAndBalance;
