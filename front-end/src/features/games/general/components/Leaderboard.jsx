import { useRef } from "react";

// *Design Imports*
import {
  VStack,
  Box,
  Divider,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  chakra,
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
            Object.keys(fsUser).length > 0 ? (
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
                      <Text
                        key={detail.username}
                        fontSize={{ base: "18px", md: "19px", xl: "19px" }}
                        fontWeight="500"
                        color="g500"
                        textAlign="center"
                        mt={i !== 0 ? "1rem" : 0}
                      >
                        <chakra.span
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
                              ? "dwordMain"
                              : "transparent"
                          }
                        >
                          {detail.username}:
                        </chakra.span>{" "}
                        {detail.totalWins}
                      </Text>
                    );
                  })
                )}

                {sameUsernameRef.current !== fsUser.username && (
                  <>
                    <Divider marginBlock="1rem" />
                    <Text
                      fontSize={{ base: "18px", md: "19px", xl: "19px" }}
                      textAlign="center"
                    >
                      {fsUser.username}:{" "}
                      <chakra.span
                        fontWeight="500"
                        color={fsUser.wins.total > 0 ? "g500" : "r600"}
                      >
                        {fsUser.wins.total}
                      </chakra.span>{" "}
                    </Text>
                  </>
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
