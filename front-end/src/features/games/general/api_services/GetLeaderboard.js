/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// *Custom Hooks Import*
import useCache from "../../../../hooks/useCache";

const GetLeaderboard = () => {
  const [notFoundErr, setNotFoundErr] = useState(false);
  const { cache, setCache } = useCache();
  const navigate = useNavigate();

  // Gets the top users from Firestore DB.
  useEffect(() => {
    let abortController;

    const fetchLeaderboard = async () => {
      setNotFoundErr("");

      try {
        if (cache.topPlayers === null) {
          abortController = new AbortController();

          const res = await axios({
            method: "GET",
            url: `http://localhost:4000/auth/api/firebase/users?leaderboard=${true}`,
            signal: abortController.signal,
            validateStatus: (status) => {
              return status === 200 || status === 404; // Resolve only if the status code is 404 or 200.
            },
          });
          // console.log(res.data);

          if (res && res.status === 200) {
            setCache((prev) => ({ ...prev, topPlayers: res.data }));
          } else if (res && res.status === 404) {
            setNotFoundErr("");
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
    fetchLeaderboard();

    return () => {
      if (abortController) abortController.abort();
    };
  }, []);

  return { topUsers: cache.topPlayers, notFoundErr };
};

export default GetLeaderboard;
