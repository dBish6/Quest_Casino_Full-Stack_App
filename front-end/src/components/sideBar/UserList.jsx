// *Design Imports*
import { HStack, Text, Avatar, Box, chakra } from "@chakra-ui/react";

// *API Services Import*
import GetAllUsers from "../../features/authentication/api_services/GetAllUsers";

// *Component Import*
import PlayerSkeleton from "../skeletons/PlayerSkeleton";

const UserList = () => {
  const [fsUsers, notFoundErr] = GetAllUsers();

  return (
    <Box>
      {!fsUsers ? (
        <PlayerSkeleton />
      ) : notFoundErr.length ? (
        <Text color="red">{notFoundErr}</Text>
      ) : (
        fsUsers.map((details, i) => {
          return (
            <HStack key={i}>
              <Box w="2rem" h="2rem" borderRadius="50%" bgColor="wMain">
                <Avatar
                  src={details.photoURL}
                  alt={`${details.username}'s Profile Picture`}
                  objectFit="contain"
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
                >
                  {details.username}
                </Text>
                <Text color="g500" fontWeight="500">
                  {details.wins ? (
                    typeof details.wins === "object" ? (
                      <>
                        Wins:{" "}
                        <chakra.span color={details.wins.total < 1 && "r600"}>
                          {details.wins.total}
                        </chakra.span>
                      </>
                    ) : (
                      <>
                        Wins:{" "}
                        <chakra.span color={details.wins < 1 && "r600"}>
                          {details.wins}
                        </chakra.span>
                      </>
                    )
                  ) : (
                    // TODO: Don't need in production.
                    <>
                      Wins: <chakra.span color="r600">0</chakra.span>
                    </>
                  )}
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
