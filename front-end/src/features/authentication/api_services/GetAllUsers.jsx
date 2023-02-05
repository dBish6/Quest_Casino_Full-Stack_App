/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GetAllUsers = () => {
  const [fsUsers, setFsUsers] = useState([]);
  const [notFoundErr, setNotFoundErr] = useState("");
  const [loading, toggleLoading] = useState(true);
  const navigate = useNavigate();

  // Gets stored user in Firestore DB.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        toggleLoading(true);
        const res = await axios({
          method: "GET",
          url: `http://localhost:4000/auth/api/firebase/users`,
          validateStatus: (status) => {
            return status === 200 || status === 404; // Resolve only if the status code is 404 or 200
          },
        });
        console.log(res.data);
        if (res && res.status === 200) {
          setFsUsers(res.data);
        } else if (res && res.status === 404) {
          setNotFoundErr("No users found.");
        }
      } catch (error) {
        console.error(error);
        navigate("/error500");
      } finally {
        toggleLoading(false);
      }
    };
    fetchUsers();
  }, []);
  // console.log(movieDetails);

  return [fsUsers, notFoundErr, loading];
};

export default GetAllUsers;
