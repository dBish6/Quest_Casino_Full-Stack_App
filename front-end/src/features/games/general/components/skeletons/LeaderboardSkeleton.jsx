// *Design Imports*
import { Skeleton, Divider } from "@chakra-ui/react";

const LeaderboardSkeleton = () => {
  const skeletons = [];
  for (let i = 0; i < 10; i++) {
    skeletons.push(
      <Skeleton
        key={i}
        noOfLines={2}
        startColor="dwordMain"
        borderRadius="4px"
        m="0 !important"
        h="27px"
        w="232px"
      />
    );
  }

  return (
    <>
      {skeletons} <Divider marginBlock="1rem" />
      <Skeleton
        noOfLines={2}
        startColor="dwordMain"
        borderRadius="4px"
        marginInline="1rem !important"
        h="27px"
        w="232px"
      />
    </>
  );
};

export default LeaderboardSkeleton;
