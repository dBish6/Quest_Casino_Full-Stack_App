import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";

const GetSessionStatus = () => {
  const navigate = useNavigate();

  const handleCheckSessionStatus = async () => {
    const abortController = new AbortController();

    try {
      const res = await axios({
        method: "GET",
        url: `${apiURL}/auth/api/firebase/user/session`,
        withCredentials: true,
        signal: abortController.signal,
        validateStatus: (status) => {
          return status === 200 || status === 401;
        },
      });
      // console.log("session res", res);

      return res;
    } catch (error) {
      if (error.code === "ECONNABORTED" || error.message === "canceled") {
        console.warn("Request was aborted.");
      } else {
        console.error(error);
        navigate("/error500");
      }
    }
  };

  return handleCheckSessionStatus;
};

export default GetSessionStatus;
