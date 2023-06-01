/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FULL_CLEAR } from "../../blackjack/redux/blackjackSlice";
import { useLocation } from "react-router-dom";

const useClearGameOnPageLeave = (game) => {
  const dispatch = useDispatch(),
    location = useLocation();

  // Dangerous but works for my case.
  useEffect(() => {
    return () => {
      if (game === "blackjack") {
        dispatch(FULL_CLEAR());
      }
    };
  }, [location.pathname]);
};

export default useClearGameOnPageLeave;
