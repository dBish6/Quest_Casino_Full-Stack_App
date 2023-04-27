/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        if (cache.userProfile === null) {
          abortController = new AbortController();
          setNotFoundErr("");
          const res = await axios({
            method: "GET",
            url: `http://localhost:4000/auth/api/firebase/users/${id}`,
            signal: abortController.signal,
            validateStatus: (status) => {
              return status === 200 || status === 404; // Resolve only if the status code is 404 or 200.
            },
          });
          // console.log(res.data);
          if (res && res.status === 200) {
            setCache((prev) => ({ ...prev, userProfile: res.data }));
          } else if (res && res.status === 404) {
            setNotFoundErr(res.data.user);
          }
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
    fetchDetails();

    return () => {
      if (abortController) abortController.abort();
    };
  }, []);

  return [cache.userProfile, notFoundErr];
};

export default GetUser;
