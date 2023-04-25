// *Design Imports*
import { WrapItem, SkeletonCircle } from "@chakra-ui/react";

const DefaultPicsSkeleton = () => {
  const skeletons = [];
  for (let i = 0; i < 15; i++) {
    skeletons.push(
      <WrapItem w="100%" maxW="115px" minH="115px" key={i}>
        <SkeletonCircle
          w="115px"
          h="115px"
          startColor="dwordMain"
          opacity="0.5"
        />
      </WrapItem>
    );
  }

  return <>{skeletons}</>;
};

export default DefaultPicsSkeleton;
