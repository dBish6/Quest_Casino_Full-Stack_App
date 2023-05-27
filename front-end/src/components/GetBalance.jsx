// *Design Imports*
import { Text, chakra, Skeleton } from "@chakra-ui/react";

// *Custom Hooks Import*
import useCache from "../hooks/useCache";

const GetBalance = (props) => {
  const { cache } = useCache();

  return (
    <>
      {cache.userProfile !== null ? (
        <Text aria-label="Balance" {...props}>
          Balance:{" "}
          <chakra.span
            color={cache.userProfile.balance === 0 ? "r500" : "g500"}
            fontWeight="500"
          >
            ${cache.userProfile.balance}
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
