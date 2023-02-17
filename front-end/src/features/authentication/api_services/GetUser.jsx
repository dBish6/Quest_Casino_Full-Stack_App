/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GetUser = (id) => {
  const [fsUser, setFsUser] = useState([]);
  const [notFoundErr, setNotFoundErr] = useState("");
  const [loading, toggleLoading] = useState(true);
  const navigate = useNavigate();

  // Gets stored user in Firestore DB.
  useEffect(() => {
    const fetchDetails = async () => {
      toggleLoading(true);
      try {
        const res = await axios({
          method: "GET",
          url: `http://localhost:4000/auth/api/firebase/users/${id}`,
          validateStatus: (status) => {
            return status === 200 || status === 404; // Resolve only if the status code is 404 or 200
          },
        });
        console.log(res.data);
        if (res && res.status === 200) {
          setFsUser(res.data);
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

  return [fsUser, notFoundErr, loading];
};

export default GetUser;
