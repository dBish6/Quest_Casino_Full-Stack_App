import { useEffect } from "react";

const useDisableScroll = (boolean, timeOnExit) => {
  useEffect(() => {
    if (boolean) {
      document.body.style.overflowY = "hidden";
    } else {
      const timeout = setTimeout(() => {
        document.body.style.overflowY = "unset";
      }, timeOnExit);
      return () => clearTimeout(timeout);
    }
  }, [boolean, timeOnExit]);
};

export default useDisableScroll;
