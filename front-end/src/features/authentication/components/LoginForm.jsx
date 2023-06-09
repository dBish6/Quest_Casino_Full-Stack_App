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

// *Custom Hooks Imports*
import useAuth from "../../../hooks/useAuth";
import useKeyboardHelper from "../../../hooks/useKeyboardHelper";

// *API Services Imports*
import PostLogin from "../api_services/PostLogin";
import PostGoogleRegister from "../api_services/PostGoogleRegister";

// *Component Imports*
import LogoutBtn from "./LogoutBtn";

const LoginForm = (props) => {
  const [visible, toggleVisibility] = useState(false);
  const [focused, setFocused] = useState(false);
  const { colorMode } = useColorMode();
  const { handleKeyDown } = useKeyboardHelper();

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
  const { handleLogin, errorHandler, successMsg, loading } = PostLogin();
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
        aria-label="User Login"
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

        <FormControl
          aria-label="Email Field"
          isInvalid={errors.email || errorHandler.notFound}
        >
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
            aria-disabled={currentUser !== null}
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
          aria-label="Password Field"
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
              aria-disabled={currentUser !== null}
              variant="primary"
              h="48px"
              paddingInline="1rem 2.5rem"
              cursor={currentUser !== null && "not-allowed"}
            />
            {visible ? (
              <Icon
                role="button"
                tabIndex={currentUser === null ? "0" : "-1"}
                aria-label="visibility"
                aria-controls="password"
                as={MdOutlineVisibilityOff}
                onClick={() => toggleVisibility(false)}
                onKeyDown={(e) =>
                  handleKeyDown(e, { toggleVisibility, type: "off" })
                }
                position="absolute"
                right="0.875rem"
                cursor="pointer"
                opacity={currentUser !== null && "0.4"}
                zIndex={currentUser !== null ? "hide" : "1"}
                color={
                  focused &&
                  currentUser === null &&
                  (colorMode === "dark" ? "p500" : "g500")
                }
              />
            ) : (
              <Icon
                role="button"
                tabIndex={currentUser === null ? "0" : "-1"}
                aria-label="visibility"
                aria-controls="password"
                as={MdOutlineVisibility}
                onClick={() => toggleVisibility(true)}
                onKeyDown={(e) =>
                  handleKeyDown(e, { toggleVisibility, type: "on" })
                }
                position="absolute"
                right="0.875rem"
                cursor="pointer"
                opacity={currentUser !== null && "0.4"}
                zIndex={currentUser !== null ? "hide" : "1"}
                color={
                  focused &&
                  currentUser === null &&
                  (colorMode === "dark" ? "p500" : "g500")
                }
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
          {errorHandler.badRequest && !errorHandler.notFound ? (
            <FormErrorMessage mt="6px">Password is incorrect.</FormErrorMessage>
          ) : undefined}
          <Box mt="6px">
            <Link
              tabIndex={currentUser === null ? "0" : "-1"}
              aria-controls="modal"
              aria-selected={props.show.passwordReset}
              onClick={() =>
                currentUser === null &&
                props.setShow({ ...props.show, passwordReset: true })
              }
              onKeyDown={(e) =>
                handleKeyDown(e, {
                  setShow: props.setShow,
                  objKey: "passwordReset",
                })
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
            aria-disabled={loading}
            type="submit"
            variant="primary"
            zIndex="1"
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
          <LogoutBtn zIndex="1" />
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
          aria-disabled={currentUser !== null || googleLoading}
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

      <Text aria-label="Create a Account" whiteSpace="nowrap">
        Don't have account?{" "}
        <Link
          tabIndex="0"
          aria-controls="modal"
          aria-selected={props.show.register}
          onClick={() => props.setShow({ ...props.show, register: true })}
          onKeyDown={(e) =>
            handleKeyDown(e, {
              setShow: props.setShow,
              objKey: "register",
            })
          }
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
