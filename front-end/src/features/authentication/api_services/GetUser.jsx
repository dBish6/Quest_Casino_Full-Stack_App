/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GetUser = (id) => {
  const [fsUser, setFsUser] = useState([]);
  const [notFoundErr, setNotFoundErr] = useState("");
  const [loadingUser, toggleLoadingUser] = useState(true);
  const navigate = useNavigate();

  const cachedUser = useMemo(() => fsUser, [fsUser]);

  // Gets stored user in Firestore DB.
  useEffect(() => {
    const fetchDetails = async () => {
      toggleLoadingUser(true);
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
        toggleLoadingUser(false);
      }
    };
    fetchDetails();
  }, [!cachedUser.length]);

  return [cachedUser, notFoundErr, loadingUser];
};

export default GetUser;
