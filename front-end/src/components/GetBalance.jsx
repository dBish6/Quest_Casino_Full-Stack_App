// *Design Imports*
import { Text, chakra, Skeleton } from "@chakra-ui/react";

// *Custom Hooks Import*
import useAuth from "../hooks/useAuth";

const GetBalance = (props) => {
  const { balance } = useAuth();

  return (
    <>
      {balance !== null ? (
        <Text aria-label="Balance" {...props}>
          Balance:{" "}
          <chakra.span color={balance === 0 ? "r500" : "g500"} fontWeight="500">
            ${balance}
          </chakra.span>
        </Text>
      ) : (
        <>
          <Skeleton
            startColor="dwordMain"
            borderRadius="4px"
            h="21px"
            w="96px"
          />
        </>
      )}
    </>
  );
};

export default GetBalance;
