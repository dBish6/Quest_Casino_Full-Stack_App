// *Design Imports*
import { Flex, SkeletonCircle, SkeletonText, Divider } from "@chakra-ui/react";

const LeaderboardSkeleton = () => {
  const skeletons = [];
  for (let i = 0; i < 10; i++) {
    skeletons.push(
      <Flex key={i} m="0 !important" w="100%" flexDir="column" align="center">
        <SkeletonCircle size="2.5rem" startColor="dwordMain" opacity="0.5" />
        <SkeletonText
          noOfLines={2}
          startColor="dwordMain"
          spacing="0.5rem"
          mt="0.5rem"
          borderRadius="4px"
          h="18px"
          w={Math.random() < 0.5 ? "102px" : "82px"}
        />
        {i !== 10 && <Divider marginBlock="1rem" />}
      </Flex>
    );
  }

  return <>{skeletons}</>;
};

export default LeaderboardSkeleton;
