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
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Link,
  HStack,
  Icon,
  Button,
  CircularProgress,
  useColorMode,
} from "@chakra-ui/react";
import { RiMedalLine } from "react-icons/ri";

// *API Services Imports*
import GetUser from "../features/authentication/api_services/GetUser";
import UpdateProfile from "../features/authentication/api_services/UpdateProfile";
import DeleteUser from "../features/authentication/api_services/DeleteUser";

// *Component Imports*
import EditableFields from "../features/authentication/components/profile/EditableFields";
import LogoutBtn from "../features/authentication/components/LogoutBtn";
import PasswordResetModal from "../features/authentication/components/modals/PasswordResetModal";
import AreYouSureModal from "../components/modals/AreYouSureModal";
import ChangePicture from "../features/authentication/components/profile/ChangePicture";

const Profile = (props) => {
  const [show, setShow] = useState({ passwordReset: false, areYouSure: false });
  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();

  const [fsUser, notFoundErr] = GetUser(currentUser.uid);
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
  const {
    handleDeleteProfile,
    unexpectedErr: deletionUnexpectedErr,
    loading: deletionLoading,
  } = DeleteUser();

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
          <Alert status="success" variant="left-accent">
            <AlertIcon />
            Email sent! Check your email for instructions.
          </Alert>
        )
      ) : undefined}
      <VStack mt={currentUser.emailVerified ? "calc(5rem + 48px)" : "5rem"}>
        {fsUser && Object.keys(fsUser).length > 0 ? (
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
                    Profile
                  </Heading>
                  <Text
                    as="small"
                    color={colorMode === "dark" ? "wMain" : "bMain"}
                    textAlign="center"
                  >
                    Edit your profile or change your profile picture!
                  </Text>
                </VStack>
                <Tabs
                  variant="enclosed"
                  borderColor={colorMode === "dark" ? "borderD" : "borderL"}
                  mt="1rem"
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
                    <TabPanel display="grid" gap="0.5rem" maxW="550px">
                      {errorHandler.unexpected ? (
                        <Alert status="error" variant="left-accent" mb="0.5rem">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Server Error 500</AlertTitle>
                            <AlertDescription>
                              Failed to update profile.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ) : errorHandler.maxRequests ? (
                        <Alert status="error" variant="left-accent" mb="0.5rem">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Max Requests</AlertTitle>
                            <AlertDescription>
                              Great job, you broke it. Please try again later.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ) : deletionUnexpectedErr.length ? (
                        <Alert status="error" variant="left-accent" mb="0.5rem">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Server Error 500</AlertTitle>
                            <AlertDescription>
                              {deletionUnexpectedErr}
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ) : undefined}
                      <HStack>
                        <Icon
                          as={RiMedalLine}
                          variant="primary"
                          fontSize="24px"
                        />
                        <Text
                          fontSize="18px"
                          color={fsUser.wins.total > 0 ? "g500" : "r600"}
                        >
                          {fsUser.wins.total}
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
                        onClick={() =>
                          setShow({ ...show, passwordReset: true })
                        }
                        variant="simple"
                        justifySelf="center"
                        mt="1rem"
                      >
                        Reset Password
                      </Link>

                      <LogoutBtn w="100%" maxW="242px" justifySelf="center" />
                      <Button
                        onClick={() => setShow({ ...show, areYouSure: true })}
                        variant="secondary"
                        w="100%"
                        maxW="242px"
                        justifySelf="center"
                        _hover={{
                          bgColor: "r500",
                          color: "wMain",
                          boxShadow: "lg",
                        }}
                        _active={{ bgColor: "r600" }}
                      >
                        Delete Profile
                      </Button>
                    </TabPanel>

                    <TabPanel>
                      <Text textAlign="center" fontSize="21px" fontWeight="500">
                        Select a picture below or upload your own!
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
                        AreYouSureModal={AreYouSureModal}
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
          <CircularProgress
            isIndeterminate
            position="absolute"
            top="50%"
            left="50%"
            transform={
              props.isLargerThan1280
                ? "translate(130%, -50%)"
                : "translate(-50%, -50%)"
            }
            size="68px"
            color={colorMode === "dark" ? "p300" : "r500"}
            borderColor={colorMode === "light" && "bMain"}
          />
        )}
      </VStack>

      <PasswordResetModal show={show} setShow={setShow} />
      <AreYouSureModal
        show={show}
        setShow={setShow}
        loading={deletionLoading}
        handleDeleteProfile={handleDeleteProfile}
        userId={currentUser.uid}
      />
    </>
  );
};

export default Profile;
