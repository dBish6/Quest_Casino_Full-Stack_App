import { useState } from "react";

// *Custom Hooks Imports*
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

// *Design Imports*
import {
  VStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  chakra,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Link,
  useColorMode,
  HStack,
  Icon,
  Flex,
  CircularProgress,
} from "@chakra-ui/react";
import { RiMedalLine } from "react-icons/ri";

// *API Services Imports*
import GetUser from "../features/authentication/api_services/GetUser";
import UpdateProfile from "../features/authentication/api_services/UpdateProfile";

// *Component Imports*
import EditableFields from "../features/authentication/components/profile/EditableFields";
import LogoutBtn from "../features/authentication/components/LogoutBtn";
import PasswordResetModal from "../features/authentication/components/modals/PasswordResetModal";
import ChangePicture from "../features/authentication/components/profile/ChangePicture";

const Profile = (props) => {
  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();

  const {
    handleUsername,
    handleFullName,
    handleEmail,
    handleEmailVerified,
    handlePhone,
    handleProfilePicture,
    emailSent,
    loadingUpdate,
    errorHandler,
  } = UpdateProfile();
  const [fsUser, notFoundErr, loadingUser] = GetUser(currentUser.uid);
  const [show, setShow] = useState(false);

  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <>
      {!currentUser.emailVerified ? (
        errorHandler.maxRequests ? (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            <Box>
              <AlertTitle>Max Requests</AlertTitle>
              <AlertDescription>
                Great job, you broke it. Please try again later.
              </AlertDescription>
            </Box>
          </Alert>
        ) : !emailSent ? (
          <Alert status="warning" variant="left-accent">
            <AlertIcon />
            <AlertDescription>
              Please verify your email by clicking the link;{" "}
              <Link onClick={() => handleEmailVerified()} color="blue.300">
                Verify Here
              </Link>
              .
            </AlertDescription>
          </Alert>
        ) : (
          // FIXME:
          <Alert status="info" variant="left-accent">
            <AlertIcon />
            Email sent! Check your email for instructions.
          </Alert>
        )
      ) : undefined}

      <VStack mt="4rem">
        {!loadingUser ? (
          notFoundErr.length ? (
            <Alert status="error" variant="left-accent">
              <AlertIcon />
              <Box>
                <AlertTitle>Server Error 404</AlertTitle>
                <AlertDescription>{notFoundErr}</AlertDescription>
              </Box>
            </Alert>
          ) : (
            <>
              <Box
                bg={colorMode === "dark" ? "fadeD" : "fadeL"}
                borderTopLeftRadius="1rem"
                borderTopRightRadius="1rem"
                p="1rem 1.5rem 3rem 1.5rem"
              >
                <VStack>
                  <Heading
                    fontSize="64px"
                    lineHeight="1.2"
                    textShadow={colorMode === "light" && "1px 1px 0px #363636"}
                  >
                    {fsUser.username}
                  </Heading>
                  <Text as="small" textAlign="center" mt="0 !important">
                    Edit your profile or change your profile picture!
                  </Text>
                </VStack>
                <Tabs
                  variant="enclosed"
                  borderColor={colorMode === "dark" ? "borderD" : "borderL"}
                  mt="0.5rem"
                >
                  <TabList display="flex" justifyContent="center">
                    <Tab
                      _selected={{
                        borderWidth: "1px",
                        borderColor:
                          colorMode === "dark" ? "borderD" : "borderL",
                        borderBottomColor:
                          colorMode === "dark"
                            ? "p500 !important"
                            : "r500 !important",
                        color: colorMode === "dark" ? "p300" : "r500",
                        fontWeight: "500",
                      }}
                      isDisabled={
                        loadingUpdate.username ||
                        loadingUpdate.name ||
                        loadingUpdate.email ||
                        loadingUpdate.phone ||
                        loadingUpdate.profilePic
                      }
                    >
                      General
                    </Tab>
                    <Tab
                      _selected={{
                        borderWidth: "1px",
                        borderColor:
                          colorMode === "dark" ? "borderD" : "borderL",
                        borderBottomColor:
                          colorMode === "dark"
                            ? "p500 !important"
                            : "r500 !important",
                        color: colorMode === "dark" ? "p300" : "r500",
                        fontWeight: "500",
                      }}
                      isDisabled={
                        loadingUpdate.username ||
                        loadingUpdate.name ||
                        loadingUpdate.email ||
                        loadingUpdate.phone ||
                        loadingUpdate.profilePic
                      }
                    >
                      Picture
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel
                      display="grid"
                      gap="0.5rem"
                      // maxW="243.283px"
                      maxW="550px"
                    >
                      {errorHandler.unexpected ? (
                        <Alert status="error" variant="left-accent" mb="1rem">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Server Error 500</AlertTitle>
                            <AlertDescription>
                              Failed to update profile.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ) : errorHandler.maxRequests ? (
                        <Alert status="error" variant="left-accent" mb="1rem">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Max Requests</AlertTitle>
                            <AlertDescription>
                              Great job, you broke it. Please try again later.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ) : undefined}
                      <HStack>
                        <Icon
                          as={RiMedalLine}
                          variant="primary"
                          fontSize={{ base: "20px", md: "24px", xl: "24px" }}
                        />
                        <Text
                          fontSize={{ base: "16px", md: "18px", xl: "18px" }}
                        >
                          Wins:{" "}
                          <chakra.span
                            color={fsUser.wins.total > 0 ? "g500" : "r600"}
                          >
                            {fsUser.wins.total}
                          </chakra.span>
                        </Text>
                      </HStack>
                      <EditableFields
                        handleUsername={handleUsername}
                        handleFullName={handleFullName}
                        handleEmail={handleEmail}
                        handlePhone={handlePhone}
                        loadingUpdate={loadingUpdate}
                        fsUser={fsUser}
                        currentUser={currentUser}
                      />

                      <Link
                        onClick={() => setShow(true)}
                        variant="simple"
                        justifySelf="center"
                        fontSize={{ base: "14px", md: "16px", xl: "16px" }}
                        mt="1rem"
                      >
                        Reset Password
                      </Link>

                      <LogoutBtn />
                    </TabPanel>

                    <TabPanel>
                      <Text textAlign="center" fontWeight="500" fontSize="21px">
                        Select a picture below!
                      </Text>
                      {errorHandler.unexpected ? (
                        <Alert status="error" variant="left-accent" mb="1rem">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Server Error 500</AlertTitle>
                            <AlertDescription>
                              Failed to update profile.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ) : errorHandler.maxRequests ? (
                        <Alert status="error" variant="left-accent" mb="1rem">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Max Requests</AlertTitle>
                            <AlertDescription>
                              Great job, you broke it. Please try again later.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ) : undefined}
                      <ChangePicture
                        handleProfilePicture={handleProfilePicture}
                        loadingUpdate={loadingUpdate}
                        currentUser={currentUser}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </>
          )
        ) : (
          <Flex>
            <CircularProgress
              isIndeterminate
              color={colorMode === "dark" ? "p300" : "r500"}
              borderColor={colorMode === "light" && "bMain"}
            />
          </Flex>
        )}
      </VStack>

      <PasswordResetModal show={show} setShow={setShow} />
    </>
  );
};

export default Profile;
