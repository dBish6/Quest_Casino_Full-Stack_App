// *Design Imports*
import { HStack, Text, Avatar, Box, chakra } from "@chakra-ui/react";

// *API Services Import*
import GetPlayerHighlight from "../../features/authentication/api_services/GetPlayerHighlight";

// *Component Import*
import PlayerSkeleton from "../skeletons/PlayerSkeleton";

const UserList = () => {
  const [fsUsers, notFoundErr] = GetPlayerHighlight();

  return (
    <Box>
      {!fsUsers ? (
        <PlayerSkeleton />
      ) : notFoundErr.length ? (
        <Text color="red">{notFoundErr}</Text>
      ) : (
        fsUsers.map((detail, i) => {
          return (
            <HStack key={i}>
              <Box w="2rem" h="2rem" borderRadius="50%" bgColor="wMain">
                <Avatar
                  src={detail.photoURL}
                  alt={`${detail.username}'s Profile Picture`}
                  w="2rem"
                  h="2rem"
                />
              </Box>
              <Box>
                <Text
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
                <Text color="g500" fontWeight="500">
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
