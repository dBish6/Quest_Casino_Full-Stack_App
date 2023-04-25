// *Design Imports*
import { HStack, SkeletonCircle, Box, SkeletonText } from "@chakra-ui/react";

const PlayerSkeleton = () => {
  const skeletons = [];
  for (let i = 0; i < 9; i++) {
    skeletons.push(
      <HStack w="130px" h="42px" key={i}>
        <Box>
          <SkeletonCircle size="32px" startColor="dwordMain" opacity="0.5" />
        </Box>
        <SkeletonText
          noOfLines={2}
          startColor="dwordMain"
          opacity="0.45"
          spacing="0.5rem"
          skeletonHeight="0.5rem"
          w="100%"
        />
      </HStack>
    );
  }

  return <>{skeletons}</>;
};

export default PlayerSkeleton;
