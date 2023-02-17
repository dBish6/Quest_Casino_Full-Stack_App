import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Custom Hooks Import*
import useAuth from "../hooks/useAuth";
import useDocumentTitle from "../hooks/useDocumentTitle";

// *Design Imports*
import {
  Button,
  VStack,
  Text,
  chakra,
  Heading,
  FormControl,
  Input,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Link,
} from "@chakra-ui/react";

// *API Services Imports*
import GetUser from "../features/authentication/api_services/GetUser";
import UpdateProfile from "../features/authentication/api_services/UpdateProfile";

// *Feature Import*
import LogoutBtn from "../features/authentication/components/profile/LogoutBtn";

const Profile = (props) => {
  const [update, toggleUpdate] = useState(false);
  const { currentUser } = useAuth();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });
  const {
    handleEmail,
    // handlePhone,
    handleEmailVerified,
    emailSent,
    successfulPost,
    errorHandler,
  } = UpdateProfile();
  const [fsUser, notFoundErr, loading] = GetUser(currentUser.uid);

  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <>
      {!currentUser.emailVerified ? (
        errorHandler.maxRequests ? (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            <Box>
              <AlertTitle>Max Requests!</AlertTitle>
              <AlertDescription>
                Great job, you broke it. Please try again later.
              </AlertDescription>
            </Box>
          </Alert>
        ) : !emailSent ? (
          <Alert status="warning" variant="left-accent">
            <AlertIcon />
            <AlertDescription>
              Please verify your email by clicking the link,{" "}
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
      <VStack>
        <Heading>Profile</Heading>
        {!update ? (
          !loading ? (
            // This will probably never happen.
            notFoundErr.length ? (
              <Alert status="error" variant="left-accent">
                <AlertIcon />
                <Box>
                  <AlertTitle>Not Found Error!</AlertTitle>
                  <AlertDescription>{notFoundErr}</AlertDescription>
                </Box>
              </Alert>
            ) : (
              <>
                <Box>
                  <Heading>User Details</Heading>
                  <Text>
                    <strong>Username:</strong> {fsUser.user.username}
                  </Text>
                  <Text>
                    <strong>Name:</strong> {fsUser.user.full_name}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {fsUser.user.email}
                  </Text>
                  {fsUser.user.phone_number && (
                    <Text>
                      <strong>Phone:</strong> {fsUser.user.phone_number}
                    </Text>
                  )}
                  <Link as={ReactRouterLink} to="/user/forgotPassword">
                    Change Password
                  </Link>
                </Box>
                <Link as={ReactRouterLink}>Quests</Link>
              </>
            )
          ) : (
            <Text>Loading...</Text>
          )
        ) : (
          <>
            {successfulPost.email_ ? (
              <Alert status="success" variant="left-accent">
                <AlertIcon />
                Email successfully updated.
              </Alert>
            ) : errorHandler.badRequest ? (
              <Alert status="error" variant="left-accent">
                <AlertIcon />
                Entry already exists for user.
              </Alert>
            ) : errorHandler.unexpected ? (
              <Alert status="error" variant="left-accent">
                <AlertIcon />
                <Box>
                  <AlertTitle>Server Error</AlertTitle>
                  <AlertDescription>Failed to update profile.</AlertDescription>
                </Box>
              </Alert>
            ) : undefined}

            <chakra.form
              onSubmit={handleSubmit(() =>
                handleEmail(currentUser.uid, watch("email"))
              )}
              display="flex"
            >
              <FormControl isInvalid={errors.email}>
                <Input
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                  name="email"
                  autoComplete="off"
                  placeholder="Email"
                  h="42px"
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <FormErrorMessage>{message}</FormErrorMessage>
                  )}
                />
              </FormControl>
              <Button type="submit">Submit</Button>
            </chakra.form>
          </>
        )}

        <LogoutBtn />
        <Button
          type={update ? "submit" : "button"}
          onClick={() => toggleUpdate(!update)}
        >
          {!update ? "Update Profile?" : "Stop Updating"}
        </Button>
      </VStack>
    </>
  );
};

export default Profile;
