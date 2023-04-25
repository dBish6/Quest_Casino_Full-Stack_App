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
import LogoutBtn from "./LogoutBtn";

const LoginForm = (props) => {
  const [visible, toggleVisibility] = useState(false);
  const [focused, setFocused] = useState(false);
  const { colorMode } = useColorMode();

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

  const { currentUser } = useAuth();

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
      >
        {successMsg.length ? (
          <Alert status="success" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            {successMsg}
          </Alert>
        ) : errorHandler.notFound ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            <Box>
              <AlertTitle>Server Error 404</AlertTitle>
              <AlertDescription>Quest user was not found.</AlertDescription>
            </Box>
          </Alert>
        ) : errorHandler.unexpected ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            <Box>
              <AlertTitle>Server Error 500</AlertTitle>
              <AlertDescription>Failed to log in.</AlertDescription>
            </Box>
          </Alert>
        ) : errorHandler.maxRequests ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            Max request reached, please try again later.
          </Alert>
        ) : undefined}

        <FormControl isInvalid={errors.email || errorHandler.notFound}>
          <FormLabel htmlFor="email" opacity={currentUser !== null && "0.4"}>
            Email
          </FormLabel>
          <Input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address.",
              },
            })}
            id="email"
            name="email"
            autoComplete="off"
            // Disables the input if the user is logged in.
            isDisabled={currentUser !== null}
            h="48px"
            variant="primary"
            cursor={currentUser !== null && "not-allowed"}
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
          <FormLabel htmlFor="password" opacity={currentUser !== null && "0.4"}>
            Password
          </FormLabel>
          <HStack data-group>
            <Input
              {...register("password", {
                required: "Password is required.",
              })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              id="password"
              name="password"
              autoComplete="off"
              type={visible ? "text" : "password"}
              isDisabled={currentUser !== null}
              variant="primary"
              h="48px"
              paddingInline="1rem 2.5rem"
              cursor={currentUser !== null && "not-allowed"}
            />
            {visible ? (
              <Icon
                as={MdOutlineVisibilityOff}
                onClick={() => toggleVisibility(false)}
                position="absolute"
                right="0.875rem"
                cursor="pointer"
                zIndex={currentUser !== null ? "hide" : "1"}
                color={focused && (colorMode === "dark" ? "p500" : "g500")}
              />
            ) : (
              <Icon
                as={MdOutlineVisibility}
                onClick={() => toggleVisibility(true)}
                position="absolute"
                right="0.875rem"
                cursor="pointer"
                zIndex={currentUser !== null ? "hide" : "1"}
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
              onClick={() =>
                currentUser === null &&
                props.setShow({ ...props.show, passwordReset: true })
              }
              position="relative"
              whiteSpace="nowrap"
              opacity={currentUser !== null ? "0.4" : "0.75"}
              _hover={
                currentUser === null && {
                  opacity: "1",
                  textDecoration: "underline",
                  textDecorationColor: colorMode === "dark" ? "p500" : "r500",
                }
              }
              _active={
                currentUser === null && {
                  top: "1.5px",
                }
              }
              cursor={currentUser !== null ? "not-allowed" : "pointer"}
            >
              Forgot your password?
            </Link>
          </Box>
        </FormControl>

        {currentUser === null ? (
          <Button
            isLoading={loading ? true : false}
            type="submit"
            variant="primary"
            m="0 auto"
            zIndex="1"
            isDisabled={currentUser !== null}
            cursor={currentUser !== null && "not-allowed"}
            _hover={
              currentUser === null && {
                bgColor: colorMode === "dark" ? "bd300" : "wMain",
                color: colorMode === "dark" ? "wMain" : "#000000",
                boxShadow: "lg",
              }
            }
            _active={
              currentUser === null && {
                bgColor: colorMode === "dark" ? "g500" : "g300",
              }
            }
          >
            Login
          </Button>
        ) : (
          <LogoutBtn m="0 auto" zIndex="1" />
        )}
      </chakra.form>
      <VStack m="1rem auto 0 auto !important" w="97%">
        <Divider />
        <Box
          bgColor={colorMode === "dark" ? "bd700" : "bl400"}
          color={currentUser !== null && "rgba(224, 226, 234, 0.4)"}
          p="0 0.5rem"
          position="relative"
          bottom="21px"
          width="fit-content"
        >
          <Text
            color={colorMode === "dark" ? "dwordMain" : "bMain"}
            opacity={currentUser !== null ? "0.4" : "1"}
          >
            or
          </Text>
        </Box>

        <Button
          isLoading={googleLoading ? true : false}
          onClick={() => handleGoogleRegister()}
          variant="primary"
          position="relative"
          bottom="24px"
          isDisabled={currentUser !== null}
          cursor={currentUser !== null && "not-allowed"}
          _hover={
            currentUser === null && {
              bgColor: colorMode === "dark" ? "bd300" : "wMain",
              color: colorMode === "dark" ? "wMain" : "#000000",
              boxShadow: "lg",
            }
          }
          _active={
            currentUser === null && {
              bgColor: colorMode === "dark" ? "g500" : "g300",
            }
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

      <Text whiteSpace="nowrap">
        Don't have account?{" "}
        <Link
          onClick={() => props.setShow({ ...props.show, register: true })}
          variant="simple"
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
            <AlertTitle>Unexpected Error!</AlertTitle>
            <AlertDescription>{googleUnexpectedErr}</AlertDescription>
          </Box>
        </Alert>
      ) : undefined}
    </>
  );
};

export default LoginForm;
