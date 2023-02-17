/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GetUserWinsBalance = (id) => {
  const [fsUserData, setFsUserData] = useState([]);
  const [notFoundErr, setNotFoundErr] = useState("");
  const [loading, toggleLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      toggleLoading(true);
      try {
        const res = await axios({
          method: "GET",
          url: `http://localhost:4000/auth/api/firebase/users/${id}?wins=${true}&balance=${true}`,
          validateStatus: (status) => {
            return status === 200 || status === 404; // Resolve only if the status code is 404 or 200
          },
        });
        console.log(res.data);
        if (res && res.status === 200) {
          setFsUserData(res.data);
        } else if (res && res.status === 404) {
          setNotFoundErr(res.data.user);
        }
      } catch (error) {
        console.error(error);
        navigate("/error500");
      } finally {
        toggleLoading(false);
      }
    };
    fetchDetails();
  }, []);

  return { fsUserData, notFoundErr, loading };
};

export default GetUserWinsBalance;
