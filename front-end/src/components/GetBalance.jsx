// *Design Imports*
import { Text, chakra, Skeleton } from "@chakra-ui/react";

// *Custom Hooks Import*
import useAuth from "../hooks/useAuth";

const GetBalance = (props) => {
  const { balance } = useAuth();

  return (
    <>
      {balance ? (
        <Text {...props}>
          Balance:{" "}
          <chakra.span
            color="g500"
            fontWeight="500"
            textShadow={props.variant === "blackjack" && "2px 1px 0px #000000"}
          >
            ${balance}
          </chakra.span>
        </Text>
      ) : (
        <>
          <Skeleton startColor="dwordMain" h="21px" w="96px" />
        </>
      )}
    </>
  );
};

export default GetBalance;
