import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Design Imports*
import {
  Container,
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
  Button,
  HStack,
  Text,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

// *API Services Imports*
import PostRegister from "../../api_services/PostRegister";

// *Component Imports*
import ModalBackdrop from "../../../../components/modals/ModalBackdrop";
import Header from "../../../../components/Header";

// *Animations*
const model = {
  visible: {
    scale: 1.0,
    y: "-50%",
    x: "-50%",
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 70 },
    },
  },
  hidden: {
    scale: 1.0,
    x: "-50%",
    opacity: 0,
  },
  exit: {
    scale: 0.8,
    x: "-50%",
    opacity: 0,
    transition: {
      duration: 0.5,
      type: "tween",
    },
  },
};

const RegisterModel = (props) => {
  const [visible, toggleVisibility] = useState({
    password: false,
    confirm: false,
  });
  const [focused, setFocused] = useState({
    password: false,
    confirm: false,
  });
  const { colorMode } = useColorMode();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      conPassword: "",
      phone: "",
    },
  });
  const formRef = useRef(null);
  const { handleRegister, errorHandler, setErrorHandler, loading } =
    PostRegister();

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 510);
    }
  }, [props.show]);

  // TODO: Password strength indicator.
  return (
    <AnimatePresence>
      {props.show && (
        <>
          <ModalBackdrop show={props.show} setShow={props.setShow} />
          <Container
            as={motion.div}
            variants={model}
            animate="visible"
            initial="hidden"
            exit="exit"
            zIndex="modal"
            display="grid"
            position="fixed"
            top="50%"
            left="50%"
            p="1.5rem"
            maxW="522px"
            backgroundColor={colorMode === "dark" ? "bd700" : "bl400"}
            borderWidth="1px"
            borderColor={colorMode === "dark" ? "borderD" : "borderL"}
            borderRadius="6px"
          >
            <Button
              onClick={() => props.setShow({ register: false })}
              variant="exit"
              position="absolute"
              top="-8px"
              right="-8px"
            >
              &#10005;
            </Button>
            <Header fontSize="32px" mb="2rem" text="Register" />

            <chakra.form
              onSubmit={handleSubmit(() =>
                handleRegister(
                  formRef,
                  watch("firstName"),
                  watch("lastName"),
                  watch("username"),
                  watch("email"),
                  watch("password"),
                  watch("conPassword"),
                  watch("phone")
                )
              )}
              ref={formRef}
            >
              {errorHandler.unexpected ? (
                <Alert status="error" variant="left-accent">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Server Error 500</AlertTitle>
                    <AlertDescription>
                      Failed to create account.
                    </AlertDescription>
                  </Box>
                </Alert>
              ) : errorHandler.maxRequests ? (
                <Alert status="error" variant="left-accent">
                  <AlertIcon />
                  Max request reached, please try again later.
                </Alert>
              ) : undefined}

              <HStack mb="1rem">
                <FormControl isInvalid={errors.firstName}>
                  <FormLabel htmlFor="firstName">
                    First Name<chakra.span color="r400"> *</chakra.span>
                  </FormLabel>
                  <Input
                    {...register("firstName", {
                      required: "First name is required.",
                      maxLength: {
                        value: 50,
                        message: "Max of 50 characters exceeded.",
                      },
                    })}
                    id="firstName"
                    name="firstName"
                    autoComplete="off"
                    variant="primary"
                    h="42px"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="firstName"
                    render={({ message }) => (
                      <FormErrorMessage>{message}</FormErrorMessage>
                    )}
                  />
                </FormControl>
                <FormControl isInvalid={errors.lastName}>
                  <FormLabel htmlFor="lastName">
                    Last Name<chakra.span color="r400"> *</chakra.span>
                  </FormLabel>
                  <Input
                    {...register("lastName", {
                      required: "Last name is required.",
                      maxLength: {
                        value: 80,
                        message: "Max of 80 characters exceeded.",
                      },
                    })}
                    id="lastName"
                    name="lastName"
                    autoComplete="off"
                    variant="primary"
                    h="42px"
                  />
                  <ErrorMessage
                    errors={errors}
                    name="lastName"
                    render={({ message }) => (
                      <FormErrorMessage>{message}</FormErrorMessage>
                    )}
                  />
                </FormControl>
              </HStack>

              <FormControl isInvalid={errors.username} mb="1rem">
                <FormLabel htmlFor="username">
                  Username<chakra.span color="r400"> *</chakra.span>
                </FormLabel>
                <Input
                  {...register("username", {
                    required: "Username is required.",
                    maxLength: {
                      value: 24,
                      message: "Username can be no more then 24 characters.",
                    },
                    minLength: {
                      value: 3,
                      message: "You can make a better username then that...",
                    },
                  })}
                  id="username"
                  name="username"
                  autoComplete="off"
                  variant="primary"
                  h="42px"
                />
                <ErrorMessage
                  errors={errors}
                  name="username"
                  render={({ message }) => (
                    <FormErrorMessage>{message}</FormErrorMessage>
                  )}
                />
              </FormControl>

              <FormControl
                isInvalid={errors.email || errorHandler.emailInUse}
                mb="1rem"
              >
                <FormLabel htmlFor="email">
                  Email<chakra.span color="r400"> *</chakra.span>
                </FormLabel>
                <Input
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address.",
                    },
                    maxLength: {
                      value: 254,
                      message: "This can't be your actual email, holy crap!.",
                    },
                  })}
                  id="email"
                  name="email"
                  autoComplete="off"
                  variant="primary"
                  h="42px"
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <FormErrorMessage>{message}</FormErrorMessage>
                  )}
                />
                {errorHandler.emailInUse ? (
                  <FormErrorMessage>
                    Email is already being used by a Quest user.
                  </FormErrorMessage>
                ) : undefined}
              </FormControl>

              <HStack mb="1rem">
                <FormControl isInvalid={errors.password}>
                  <FormLabel htmlFor="password">
                    Password<chakra.span color="r400"> *</chakra.span>
                  </FormLabel>
                  <HStack>
                    <Input
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters.",
                        },
                        maxLength: {
                          value: 128,
                          message: "Max of 128 characters exceeded.",
                        },
                      })}
                      onFocus={() => setFocused({ password: true })}
                      onBlur={() => setFocused({ password: false })}
                      id="password"
                      name="password"
                      type={visible.password ? "text" : "password"}
                      variant="primary"
                      paddingInline="1rem 2.5rem"
                      h="42px"
                    />
                    {visible.password ? (
                      <Icon
                        as={MdOutlineVisibilityOff}
                        onClick={() => toggleVisibility({ password: false })}
                        position="absolute"
                        right="0.875rem"
                        cursor="pointer"
                        zIndex="1"
                        color={
                          focused.password &&
                          (colorMode === "dark" ? "p500" : "g500")
                        }
                      />
                    ) : (
                      <Icon
                        as={MdOutlineVisibility}
                        onClick={() => toggleVisibility({ password: true })}
                        position="absolute"
                        right="0.875rem"
                        cursor="pointer"
                        zIndex="1"
                        color={
                          focused.password &&
                          (colorMode === "dark" ? "p500" : "g500")
                        }
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
                </FormControl>
                <FormControl
                  isInvalid={errors.conPassword || errorHandler.confirmation}
                >
                  <FormLabel htmlFor="conPassword">
                    Confirm Password
                    <chakra.span color="r400"> *</chakra.span>
                  </FormLabel>
                  <HStack>
                    <Input
                      {...register("conPassword", {
                        required: "Please confirm your password.",
                        maxLength: {
                          value: 128,
                          message: "Max of 128 characters exceeded.",
                        },
                        onChange: (e) => {
                          if (e.target.value === watch("password"))
                            setErrorHandler({ confirmation: false });
                        },
                      })}
                      onFocus={() => setFocused({ confirm: true })}
                      onBlur={() => setFocused({ confirm: false })}
                      id="conPassword"
                      name="conPassword"
                      type={visible.confirm ? "text" : "password"}
                      variant="primary"
                      paddingInline="1rem 2.5rem"
                      h="42px"
                    />
                    {visible.confirm ? (
                      <Icon
                        as={MdOutlineVisibilityOff}
                        onClick={() => toggleVisibility({ confirm: false })}
                        position="absolute"
                        right="0.875rem"
                        cursor="pointer"
                        zIndex="1"
                        color={
                          focused.confirm &&
                          (colorMode === "dark" ? "p500" : "g500")
                        }
                      />
                    ) : (
                      <Icon
                        as={MdOutlineVisibility}
                        onClick={() => toggleVisibility({ confirm: true })}
                        position="absolute"
                        right="0.875rem"
                        cursor="pointer"
                        zIndex="1"
                        color={
                          focused.confirm &&
                          (colorMode === "dark" ? "p500" : "g500")
                        }
                      />
                    )}
                  </HStack>
                  <ErrorMessage
                    errors={errors}
                    name="conPassword"
                    render={({ message }) => (
                      <FormErrorMessage>{message}</FormErrorMessage>
                    )}
                  />
                  {errorHandler.confirmation ? (
                    <FormErrorMessage>Passwords do not match.</FormErrorMessage>
                  ) : undefined}
                </FormControl>
              </HStack>

              {/* TODO: Country codes. */}
              <FormControl isInvalid={errorHandler.phoneInUse}>
                <FormLabel htmlFor="phone">Phone</FormLabel>
                <Input
                  {...register("phone", {
                    required: false,
                    maxLength: {
                      value: 15,
                      message: "Max of 15 characters exceeded.",
                    },
                  })}
                  id="phone"
                  name="phone"
                  autoComplete="off"
                  variant="primary"
                  h="42px"
                />
                <ErrorMessage
                  errors={errors}
                  name="phone"
                  render={({ message }) => (
                    <FormErrorMessage>{message}</FormErrorMessage>
                  )}
                />
                {errorHandler.phoneInUse ? (
                  <FormErrorMessage>
                    Phone number is already used by a Quest user.
                  </FormErrorMessage>
                ) : undefined}
              </FormControl>

              <Button
                isLoading={loading ? true : false}
                type="submit"
                variant="primary"
                mt="1.5rem"
                w="100%"
              >
                Sign Up
              </Button>
            </chakra.form>
            <Text as="small" textAlign="center" mt="12px">
              By clicking on{" "}
              <chakra.span
                fontWeight="500"
                color="p500"
                textShadow={colorMode === "light" && "1px 1px 0px #363636"}
              >
                "Sign Up"
              </chakra.span>
              , you agree to the Quest Casino's{" "}
              <Link
                fontWeight="500"
                color="r500"
                opacity="0.8"
                _hover={{
                  opacity: "1",
                  textDecoration: "underline",
                  textDecorationColor: "r500",
                }}
              >
                terms
              </Link>{" "}
              and{" "}
              <Link
                fontWeight="500"
                color="g500"
                opacity="0.8"
                _hover={{
                  opacity: "1",
                  textDecoration: "underline",
                  textDecorationColor: "g500",
                }}
              >
                privacy policy
              </Link>
              .
            </Text>
          </Container>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegisterModel;
