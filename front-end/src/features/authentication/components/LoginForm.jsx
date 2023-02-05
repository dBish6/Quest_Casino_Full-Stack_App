import { useState, useRef } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Design Imports*
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  chakra,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Icon,
  Link,
  Button,
  Text,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";

// *API Services Imports*
import SaveLogin from "../api_services/SaveLogin";
import PostGoogleRegister from "../api_services/PostGoogleRegister";

const LoginForm = () => {
  const [visible, toggleVisibility] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const formRef = useRef(null);
  const { handleLogin, errorHandler, successMsg, loading } = SaveLogin();
  const {
    handleGoogleRegister,
    googleSuccessMsg,
    googleUnexpectedErr,
    googleLoading,
  } = PostGoogleRegister();

  // console.log(watch());
  return (
    <>
      <chakra.form
        onSubmit={handleSubmit(() =>
          handleLogin(formRef, watch("email"), watch("password"))
        )}
        ref={formRef}
        justifySelf="center"
      >
        {successMsg.length ? (
          <Alert status="success" variant="left-accent">
            <AlertIcon />
            {successMsg}
          </Alert>
        ) : errorHandler.notFound ? (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            Quest user was not found.
          </Alert>
        ) : errorHandler.unexpected ? (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            <Box>
              <AlertTitle>Unexpected Error!</AlertTitle>
              <AlertDescription>
                Failed to log in, please try again.
              </AlertDescription>
            </Box>
          </Alert>
        ) : errorHandler.maxRequests ? (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            Max request reached, please try again later.
          </Alert>
        ) : undefined}

        <FormControl isInvalid={errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address.",
              },
            })}
            name="email"
            autoComplete="off"
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

        <Link as={ReactRouterLink} to="/user/forgotPassword">
          Forgot your password?
        </Link>
        <FormControl isInvalid={errors.password || errorHandler.badRequest}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <HStack>
            <Input
              {...register("password", {
                required: "Password is required.",
              })}
              name="password"
              type={visible ? "text" : "password"}
              h="42px"
              paddingInline="1rem 2.5rem"
            />
            {visible ? (
              <Icon
                as={MdOutlineVisibilityOff}
                onClick={() => toggleVisibility(false)}
                position="absolute"
                right="0.875rem"
                cursor="pointer"
              />
            ) : (
              <Icon
                as={MdOutlineVisibility}
                onClick={() => toggleVisibility(true)}
                position="absolute"
                right="0.875rem"
                cursor="pointer"
              />
            )}
          </HStack>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <FormErrorMessage>{message}</FormErrorMessage>
            )}
          />
          {errorHandler.badRequest ? (
            <FormErrorMessage>Password is incorrect.</FormErrorMessage>
          ) : undefined}
        </FormControl>

        {/* TODO: Loading icon.*/}
        <Button disabled={loading ? true : false} type="submit">
          Login
        </Button>
        <Text>
          Don't have account?{" "}
          <Link as={ReactRouterLink} to="/register">
            Sign Up
          </Link>
        </Text>
      </chakra.form>

      <Divider />
      <Text>OR</Text>
      <Button
        disabled={googleLoading ? true : false}
        onClick={() => handleGoogleRegister()}
      >
        Google Login
      </Button>
      {googleSuccessMsg.length ? (
        <Alert status="success" variant="left-accent" mt="1rem">
          <AlertIcon />
          {googleSuccessMsg}
        </Alert>
      ) : googleUnexpectedErr.length ? (
        <Alert status="error" variant="left-accent" mt="1rem">
          <AlertIcon />
          <Box>
            <AlertTitle>Unexpected Google Error!</AlertTitle>
            <AlertDescription>{googleUnexpectedErr}</AlertDescription>
          </Box>
        </Alert>
      ) : undefined}
    </>
  );
};

export default LoginForm;
