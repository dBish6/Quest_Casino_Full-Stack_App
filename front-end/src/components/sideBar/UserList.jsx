// *Design Imports*
import { HStack, Text, Image, Box } from "@chakra-ui/react";

// *API Services Imports*
import GetAllUsers from "../../features/authentication/api_services/GetAllUsers";

// *Component Imports*
import PlayerSkeleton from "../../skeletons/PlayerSkeleton";

const UserList = () => {
  const [fsUsers, notFoundErr, loading] = GetAllUsers();

  return (
    <Box>
      {loading ? (
        <PlayerSkeleton />
      ) : notFoundErr.length ? (
        <Text color="red">{notFoundErr}</Text>
      ) : (
        fsUsers.map((details, i) => {
          return (
            <HStack key={i}>
              <Box
                w="2rem"
                maxW="552px"
                h="2rem"
                borderRadius="50%"
                bgColor="wMain"
              >
                <Image
                  src={details.photoURL}
                  //   alt="https://i.ibb.co/YXgGLwq/profile-stock.png"
                  objectFit="contain"
                  borderRadius="50%"
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
                  {details.wins ? details.wins : "Wins: 0"}
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
