/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const GetUserBalance = (id, blackjack) => {
  const [fsUserBalance, setFsUserBalance] = useState(0);
  const [notFoundErr, setNotFoundErr] = useState("");
  const [loading, toggleLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const abortController = new AbortController();

  // Used for home.
  useEffect(() => {
    if (!blackjack) {
      const fetchDetails = async () => {
        toggleLoading(true);
        try {
          const res = await axios({
            method: "GET",
            url: `http://localhost:4000/auth/api/firebase/users/${id}?balance=${true}`,
            signal: abortController.signal,
            validateStatus: (status) => {
              return status === 200 || status === 404; // Resolve only if the status code is 404 or 200
            },
          });
          // console.log("balance", res.data);
          if (res && res.status === 200) {
            setFsUserBalance(res.data);
          } else if (res && res.status === 404) {
            setNotFoundErr(res.data.user);
          }
        } catch (error) {
          if (error.code === "ECONNABORTED") {
            console.warn("Request was aborted.");
          } else {
            console.error(error);
            navigate("/error500");
          }
        } finally {
          toggleLoading(false);
        }
      };
      fetchDetails();

      return () => abortController.abort();
    }
  }, []);

  // Used for blackjack.
  const fetchBalance = async (dispatch, SET_WALLET) => {
    toggleLoading(true);
    try {
      const res = await axios({
        method: "GET",
        url: `http://localhost:4000/auth/api/firebase/users/${id}?balance=${true}`,
        signal: abortController.signal,
        validateStatus: (status) => {
          return status === 200 || status === 404; // Resolve only if the status code is 404 or 200
        },
      });
      // console.log("balance", res.data);
      if (res && res.status === 200) {
        dispatch(SET_WALLET(res.data));
      } else if (res && res.status === 404) {
        toast({
          description: `Server Error 404: ${res.data.user}`,
          status: "error",
          duration: 99999999,
          isClosable: true,
          position: "top",
          variant: "solid",
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.warn("Request was aborted.");
      } else {
        console.error(error);
        navigate("/error500");
      }
    } finally {
      toggleLoading(false);
    }
  };

  return { fetchBalance, fsUserBalance, notFoundErr, loading, abortController };
};

export default GetUserBalance;
