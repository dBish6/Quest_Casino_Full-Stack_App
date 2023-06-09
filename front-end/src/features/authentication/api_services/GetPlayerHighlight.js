/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";

// *Custom Hooks Import*
import useCache from "../../../hooks/useCache";

const GetPlayerHighlight = () => {
  const [notFoundErr, setNotFoundErr] = useState("");
  const { cache, setCache } = useCache();
  const navigate = useNavigate();

  // Gets all users in Firestore DB.
  useEffect(() => {
    let abortController;

    const fetchUsers = async () => {
      try {
        if (cache.playersHighlight === null) {
          abortController = new AbortController();
          const res = await axios({
            method: "GET",
            url: `${apiURL}/auth/api/firebase/users`,
            signal: abortController.signal,
            validateStatus: (status) => {
              return status === 200 || status === 404 || status === 429;
            },
          });
          // console.log(res.data);
          if (res) {
            if (res.status === 200) {
              setCache((prev) => ({ ...prev, playersHighlight: res.data }));
            } else if (res.status === 404) {
              setNotFoundErr("No users found.");
            }
          }
        }
      } catch (error) {
        if (error.code === "ECONNABORTED" || error.message === "canceled") {
          console.warn("Request was aborted.");
        } else if (error.response && error.response.status === 429) {
          navigate("/error429");
        } else {
          console.error(error);
          navigate("/error500");
        }
      }
    };
    fetchUsers();

    return () => {
      if (abortController) abortController.abort();
    };
  }, []);

  return [cache.playersHighlight, notFoundErr];
};

export default GetPlayerHighlight;
