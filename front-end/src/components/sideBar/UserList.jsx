// *Design Imports*
import { HStack, Text, Avatar, Box, chakra } from "@chakra-ui/react";

// *Component Import*
import PlayerSkeleton from "../skeletons/PlayerSkeleton";

const UserList = (props) => {
  return (
    <Box>
      {!props.fsUsers ? (
        <PlayerSkeleton />
      ) : props.notFoundErr.length ? (
        <Text aria-label="Error Text" color="red">
          {props.notFoundErr}
        </Text>
      ) : (
        props.fsUsers.map((detail, i) => {
          return (
            <HStack key={i}>
              <Box
                aria-label={`${detail.username}'s Profile Picture`}
                w="2rem"
                h="2rem"
                borderRadius="50%"
                bgColor="wMain"
              >
                <Avatar src={detail.photoURL} w="2rem" h="2rem" />
              </Box>
              <Box>
                <Text
                  aria-label={`${detail.username}'s Username`}
                  color="r500"
                  fontWeight="500"
                  position="relative"
                  top="3px"
                  maxW="100px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {detail.username}
                </Text>
                <Text
                  aria-label={`${detail.username}'s Wins`}
                  color="g500"
                  fontWeight="500"
                >
                  Wins:{" "}
                  <chakra.span color={detail.wins.total < 1 && "r600"}>
                    {detail.wins.total}
                  </chakra.span>
                </Text>
              </Box>
            </HStack>
          );
        })
      )}
    </Box>
  );
};

export default UserList;
