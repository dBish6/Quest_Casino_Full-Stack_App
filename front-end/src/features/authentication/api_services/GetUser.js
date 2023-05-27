/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiURL from "../../../apiUrl";

// *Custom Hooks Import*
import useCache from "../../../hooks/useCache";

const GetUser = (id) => {
  const [notFoundErr, setNotFoundErr] = useState("");
  const { cache, setCache } = useCache();
  const navigate = useNavigate();

  // Gets stored user in Firestore DB.
  useEffect(() => {
    let abortController;

    const fetchDetails = async () => {
      try {
        if (
          cache.userProfile === null ||
          (cache.userProfile && Object.keys(cache.userProfile).length <= 2)
        ) {
          abortController = new AbortController();
          setNotFoundErr("");
          const res = await axios({
            method: "GET",
            url: `${apiURL}/auth/api/firebase/users/${id}`,
            withCredentials: true,
            signal: abortController.signal,
            validateStatus: (status) => {
              return status === 200 || status === 404; // Resolve only if the status code is 404 or 200.
            },
          });
          // console.log(res.data);
          if (res && res.status === 200) {
            setCache((prev) => ({
              ...prev,
              userProfile: { ...prev.userProfile, ...res.data },
            }));
          } else if (res && res.status === 404) {
            setNotFoundErr(res.data.user);
          }
        }
      } catch (error) {
        if (error.code === "ECONNABORTED" || error.message === "canceled") {
          console.warn("Request was aborted.");
        } else if (error.response && error.response.status === 401) {
          console.error(error);
          navigate("/error401");
        } else {
          console.error(error);
          navigate("/error500");
        }
      }
    };
    fetchDetails();

    return () => {
      if (abortController) abortController.abort();
    };
  }, []);

  return [cache.userProfile, notFoundErr];
};

export default GetUser;
