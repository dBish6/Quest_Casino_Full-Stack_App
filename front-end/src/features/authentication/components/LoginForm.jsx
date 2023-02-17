import { useState, useRef } from "react";
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
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

// *API Services Imports*
import SaveLogin from "../api_services/SaveLogin";
import PostGoogleRegister from "../api_services/PostGoogleRegister";

// *Component Imports*
import PasswordResetModel from "./modals/PasswordResetModel";
import RegisterModel from "./modals/RegisterModel";

const LoginForm = () => {
  const [visible, toggleVisibility] = useState(false);
  const [focused, setFocused] = useState(false);
  const { colorMode } = useColorMode();
  const [show, setShow] = useState({
    passwordReset: false,
    register: false,
  });
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

  const { currentUser, loadingUser } = useAuth();

  // console.log(watch());
  return (
    <>
      <chakra.form
        onSubmit={handleSubmit(() =>
          handleLogin(formRef, watch("email"), watch("password"))
        )}
        ref={formRef}
        justifySelf="center"
        display="flex"
        flexDir="column"
        gap="1rem"
        // TODO:
        // style={currentUser !== null && { pointerEvents: "none" }}
      >
        {successMsg.length ? (
          <Alert status="success" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            {successMsg}
          </Alert>
        ) : errorHandler.notFound ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            Quest user was not found.
          </Alert>
        ) : errorHandler.unexpected ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            <Box>
              <AlertTitle>Unexpected Error!</AlertTitle>
              <AlertDescription>
                Failed to log in, please try again.
              </AlertDescription>
            </Box>
          </Alert>
        ) : errorHandler.maxRequests ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            Max request reached, please try again later.
          </Alert>
        ) : undefined}

        <FormControl isInvalid={errors.email || errorHandler.notFound}>
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
            h="48px"
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <FormErrorMessage mt="6px">{message}</FormErrorMessage>
            )}
          />
        </FormControl>
        <FormControl
          isInvalid={
            errors.password || errorHandler.badRequest || errorHandler.notFound
          }
        >
          <FormLabel htmlFor="password">Password</FormLabel>
          <HStack data-group>
            <Input
              {...register("password", {
                required: "Password is required.",
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              name="password"
              type={visible ? "text" : "password"}
              h="48px"
              paddingInline="1rem 2.5rem"
            />
            {visible ? (
              <Icon
                as={MdOutlineVisibilityOff}
                onClick={() => toggleVisibility(false)}
                position="absolute"
                right="0.875rem"
                cursor="pointer"
                zIndex="1"
                color={focused && (colorMode === "dark" ? "p500" : "g500")}
              />
            ) : (
              <Icon
                as={MdOutlineVisibility}
                onClick={() => toggleVisibility(true)}
                position="absolute"
                right="0.875rem"
                cursor="pointer"
                zIndex="1"
                color={focused && (colorMode === "dark" ? "p500" : "g500")}
              />
            )}
          </HStack>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <FormErrorMessage mt="6px">{message}</FormErrorMessage>
            )}
          />
          {errorHandler.badRequest ? (
            <FormErrorMessage mt="6px">Password is incorrect.</FormErrorMessage>
          ) : undefined}
          <Box mt="6px">
            <Link
              onClick={() => setShow({ passwordReset: true })}
              position="relative"
              opacity="0.75"
              _hover={{
                opacity: "1",
                textDecoration: "underline",
                textDecorationColor: colorMode === "dark" ? "p500" : "r500",
              }}
              _active={{
                top: "1.5px",
              }}
            >
              Forgot your password?
            </Link>
          </Box>
        </FormControl>

        <Button
          isLoading={loading ? true : false}
          type="submit"
          variant="primary"
          zIndex="1"
        >
          Login
        </Button>
      </chakra.form>
      <VStack
        mt="1rem"
        style={
          currentUser !== null
            ? {
                pointerEvents: "none",
                cursor: "not-allowed",
              }
            : undefined
        }
      >
        <Divider />
        <Box
          bgColor={colorMode === "dark" ? "bd700" : "bl400"}
          p="0 0.5rem"
          position="relative"
          bottom="21px"
          width="fit-content"
        >
          <Text>or</Text>
        </Box>

        <Button
          isLoading={googleLoading ? true : false}
          onClick={() => {
            handleGoogleRegister();
            console.log("click");
          }}
          variant="primary"
          position="relative"
          bottom="24px"
          style={
            currentUser !== null
              ? {
                  cursor: "not-allowed",
                  pointerEvents: "none",
                }
              : undefined
          }
        >
          <Icon
            as={FcGoogle}
            bgColor="wMain"
            fontSize="24px"
            borderRadius="16px"
            p="1px"
            mr="4px"
          />
          Google Login
        </Button>
      </VStack>

      <Text>
        Don't have account?{" "}
        <Link
          onClick={() => setShow({ register: true })}
          position="relative"
          opacity="0.75"
          _hover={{
            opacity: "1",
            textDecoration: "underline",
            textDecorationColor: colorMode === "dark" ? "p500" : "r500",
          }}
          _active={{
            top: "1.5px",
          }}
        >
          Sign Up
        </Link>
        !
      </Text>

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

      <PasswordResetModel show={show.passwordReset} setShow={setShow} />
      <RegisterModel show={show.register} setShow={setShow} />
    </>
  );
};

export default LoginForm;
