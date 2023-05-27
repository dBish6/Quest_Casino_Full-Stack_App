import { useRef } from "react";

// *Design Imports*
import {
  VStack,
  Flex,
  Box,
  Divider,
  Avatar,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorMode,
} from "@chakra-ui/react";

// *Custom Hooks Import*
import useAuth from "../../../../hooks/useAuth";

// *API Services Import*
import GetLeaderboard from "../api_services/GetLeaderboard";
import GetUser from "../../../authentication/api_services/GetUser";

// *Component Import*
import LeaderboardSkeleton from "./skeletons/LeaderboardSkeleton";

const Leaderboard = () => {
  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();
  const { topUsers, notFoundErr: leaderboardNotFoundErr } = GetLeaderboard();
  const [fsUser, userNotFoundErr] = GetUser(currentUser.uid);

  const sameUsernameRef = useRef(null);

  return (
    <>
      <VStack mt="2rem">
        <Box
          bg={colorMode === "dark" ? "fadeD" : "fadeL"}
          borderTopLeftRadius="1rem"
          borderTopRightRadius="1rem"
          p="1rem 1.5rem 3rem 1.5rem"
          minW={{ base: "275px", md: "300px", xl: "300px" }}
        >
          <Box>
            {topUsers &&
            topUsers.length > 0 &&
            fsUser &&
            Object.keys(fsUser).length > 4 ? (
              <>
                {leaderboardNotFoundErr.length || userNotFoundErr.length ? (
                  <Alert status="error" variant="left-accent">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Server Error 404</AlertTitle>
                      <AlertDescription>
                        {leaderboardNotFoundErr || userNotFoundErr}
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  topUsers.map((detail, i) => {
                    if (detail.username === fsUser.username)
                      sameUsernameRef.current = detail.username;

                    return (
                      <Flex
                        key={detail.username}
                        pos="relative"
                        flexDir="column"
                        align="center"
                      >
                        <Text
                          pos="absolute"
                          top="2%"
                          left="4px"
                          fontSize={{ base: "21px", md: "24px", xl: "24px" }}
                          color={
                            i === 0
                              ? "p300"
                              : i === 1
                              ? "#A9A9A9"
                              : i === 2
                              ? "#977F5B"
                              : colorMode === "dark"
                              ? "wMain"
                              : "bMain"
                          }
                          opacity="0.65"
                        >
                          {i + 1}.
                        </Text>
                        <Box
                          w="2.5rem"
                          h="2.5rem"
                          borderRadius="50%"
                          bgColor="wMain"
                        >
                          <Avatar
                            src={detail.photoURL}
                            alt={`${detail.username}'s Profile Picture`}
                            w="2.5rem"
                            h="2.5rem"
                          />
                        </Box>
                        <Text
                          fontSize={{ base: "17px", md: "18px", xl: "18px" }}
                          fontWeight={i <= 2 && "600"}
                          bgGradient={
                            i === 0
                              ? "linear(45deg, #f4f4f4 , #D8B805)"
                              : i === 1
                              ? "linear(45deg, #f4f4f4, #A9A9A9)"
                              : ""
                          }
                          bgClip={i <= 2 && "text"}
                          color={
                            i === 2
                              ? "#977F5B"
                              : i > 2
                              ? colorMode === "dark"
                                ? "wMain"
                                : "bMain"
                              : "transparent"
                          }
                          lineHeight="0.95"
                          textAlign="center"
                          mt="0.5rem"
                        >
                          {detail.username}
                        </Text>
                        <Text
                          fontSize={{ base: "17px", md: "18px", xl: "18px" }}
                          fontWeight="500"
                          color="g500"
                          textAlign="center"
                        >
                          {detail.wins.total} Wins
                        </Text>
                        <Divider marginBlock="1rem" />
                      </Flex>
                    );
                  })
                )}

                {sameUsernameRef.current !== fsUser.username && (
                  <Flex pos="relative" flexDir="column" align="center">
                    <Text
                      pos="absolute"
                      top="2%"
                      left="4px"
                      fontSize={{ base: "18px", md: "21px", xl: "21px" }}
                      color={colorMode === "dark" ? "wMain" : "bMain"}
                      opacity="0.65"
                    >
                      You:
                    </Text>
                    <Box
                      w="2.5rem"
                      h="2.5rem"
                      borderRadius="50%"
                      bgColor="wMain"
                    >
                      <Avatar
                        src={fsUser.photoURL}
                        alt={`${fsUser.username}'s Profile Picture`}
                        w="2.5rem"
                        h="2.5rem"
                      />
                    </Box>
                    <Text
                      fontSize={{ base: "17px", md: "18px", xl: "18px" }}
                      textAlign="center"
                      lineHeight="0.95"
                      mt="0.5rem"
                    >
                      {fsUser.username}
                    </Text>
                    <Text
                      fontSize={{ base: "17px", md: "18px", xl: "18px" }}
                      fontWeight="500"
                      color={fsUser.wins.total > 0 ? "g500" : "r600"}
                      textAlign="center"
                    >
                      {fsUser.wins.total} Wins
                    </Text>
                  </Flex>
                )}
              </>
            ) : (
              <VStack gap="1rem">
                <LeaderboardSkeleton />
              </VStack>
            )}
          </Box>
        </Box>
      </VStack>
    </>
  );
};

export default Leaderboard;
