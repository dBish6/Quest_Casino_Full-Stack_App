import { useLayoutEffect } from "react";

const useChangeBackground = (img) => {
  useLayoutEffect(() => {
    document.body.style.backgroundImage = `url(${img})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    return () => {
      document.body.style.backgroundImage = null;
      document.body.style.backgroundSize = null;
      document.body.style.backgroundPosition = null;
      document.body.style.backgroundRepeat = null;
    };
  }, [img]);
};

export default useChangeBackground;
