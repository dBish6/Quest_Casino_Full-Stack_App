import { Tooltip } from "@chakra-ui/react";
import useCache from "../hooks/useCache";

const MyTooltip = (props) => {
  const { cache } = useCache();

  return (
    <>
      {cache.tipsEnabled || !localStorage.getItem("tipsDisabled") ? (
        <Tooltip hasArrow {...props}>
          {props.children}
        </Tooltip>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};

export default MyTooltip;
