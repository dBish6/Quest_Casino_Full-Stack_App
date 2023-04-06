import { useEffect } from "react";

const useDisableScroll = (boolean, timeOnExit) => {
  useEffect(() => {
    if (boolean) {
      document.body.style.overflow = "hidden";
    } else {
      const timeout = setTimeout(() => {
        document.body.style.overflow = "unset";
      }, timeOnExit);
      return () => clearTimeout(timeout);
    }
  }, [boolean, timeOnExit]);
};

export default useDisableScroll;
