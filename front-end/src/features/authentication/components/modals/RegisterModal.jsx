/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Design Imports*
import {
  FormControl,
  FormLabel,
  Input,
  Progress,
  Select,
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

// *Custom Hooks Import*
import useDisableScroll from "../../../../hooks/useDisableScroll";
import usePhoneFormat from "../../hooks/usePhoneFormat";

// *Utility Imports*
import COUNTRIES from "../../utils/COUNTRIES";
import calculatePasswordStrength from "../../utils/calculatePasswordStrength";

// *API Services Import*
import PostRegister from "../../api_services/PostRegister";

// *Component Imports*
import ModalTemplate from "../../../../components/modals/ModalTemplate";
import MyHeading from "../../../../components/MyHeading";

const RegisterModal = (props) => {
  const [visible, toggleVisibility] = useState({
    password: false,
    confirm: false,
  });
  const [focused, setFocused] = useState({
    password: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const showRef = useRef(null);
  const formRef = useRef(null);
  const { colorMode } = useColorMode();

  const { handleRegister, errorHandler, setErrorHandler, loading } =
    PostRegister();
  const { handlePhoneFormat, inputValue, handlePhoneErrorMsg, errorMsg } =
    usePhoneFormat();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      conPassword: "",
      callingCode: "",
      phone: "",
    },
  });

  const show =
    typeof props.show === "object"
      ? (showRef.current = props.show.register)
      : (showRef.current = props.show);

  useDisableScroll(show, 510);

  useEffect(() => {
    const strength = calculatePasswordStrength(watch("password"));
    setPasswordStrength(strength);
  }, [watch("password")]);

  useEffect(() => {
    if (props.show === false) showRef.current = false;
  }, [props.show]);

  useEffect(() => {
    if (!watch("phone").length && show) {
      setValue("callingCode", "");
    }
  }, [watch("phone")]);

  return (
    <ModalTemplate
      show={typeof props.show === "object" ? props.show.register : props.show}
      setShow={props.setShow}
      objName={typeof props.show === "object" && "register"}
      animation={{ type: "up", y: "0" }}
      display="grid"
      maxW="522px"
    >
      <Button
        onClick={() =>
          typeof props.show === "object"
            ? props.setShow({ ...props.show, register: false })
            : props.setShow(false)
        }
        variant="exit"
        position="absolute"
        top="-8px"
        right="-8px"
      >
        &#10005;
      </Button>
      <MyHeading fontSize="32px" mb="2rem" text="Register" />

      <chakra.form
        onSubmit={handleSubmit(() =>
          handleRegister(
            formRef,
            "Standard",
            watch("firstName"),
            watch("lastName"),
            watch("username"),
            watch("email"),
            watch("password"),
            watch("conPassword"),
            watch("callingCode"),
            watch("phone"),
            setPasswordStrength
          )
        )}
        ref={formRef}
      >
        {errorHandler.unexpected ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            <Box>
              <AlertTitle>Server Error 500</AlertTitle>
              <AlertDescription>Failed to create account.</AlertDescription>
            </Box>
          </Alert>
        ) : errorHandler.maxRequests ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            Max request reached, please try again later.
          </Alert>
        ) : undefined}

        <HStack mb="1rem">
          <FormControl isInvalid={errors.firstName}>
            <FormLabel
              htmlFor="firstName"
              fontSize={{ base: "14px", md: "16px", xl: "16px" }}
              fontWeight={{ base: "600", md: "500", xl: "500" }}
            >
              First Name
              <chakra.span aria-label="Required" color="r400">
                {" "}
                *
              </chakra.span>
            </FormLabel>
            <Input
              {...register("firstName", {
                required: "First name is required.",
                maxLength: {
                  value: 50,
                  message: "Max of 50 characters exceeded.",
                },
              })}
              aria-required="true"
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
            <FormLabel
              htmlFor="lastName"
              fontSize={{ base: "14px", md: "16px", xl: "16px" }}
              fontWeight={{ base: "600", md: "500", xl: "500" }}
            >
              Last Name
              <chakra.span aria-label="Required" color="r400">
                {" "}
                *
              </chakra.span>
            </FormLabel>
            <Input
              {...register("lastName", {
                required: "Last name is required.",
                maxLength: {
                  value: 80,
                  message: "Max of 80 characters exceeded.",
                },
              })}
              aria-required="true"
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

        <FormControl
          isInvalid={errors.username || errorHandler.usernameInUse.length}
          mb="1rem"
        >
          <FormLabel
            htmlFor="username"
            fontSize={{ base: "14px", md: "16px", xl: "16px" }}
            fontWeight={{ base: "600", md: "500", xl: "500" }}
          >
            Username
            <chakra.span aria-label="Required" color="r400">
              {" "}
              *
            </chakra.span>
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
            aria-required="true"
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
          {errorHandler.usernameInUse.length ? (
            <FormErrorMessage>{errorHandler.usernameInUse}</FormErrorMessage>
          ) : undefined}
        </FormControl>

        <FormControl
          isInvalid={errors.email || errorHandler.emailInUse}
          mb="1rem"
        >
          <FormLabel
            htmlFor="email"
            fontSize={{ base: "14px", md: "16px", xl: "16px" }}
            fontWeight={{ base: "600", md: "500", xl: "500" }}
          >
            Email
            <chakra.span aria-label="Required" color="r400">
              {" "}
              *
            </chakra.span>
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
            aria-required="true"
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

        <HStack mb="10px">
          <FormControl isInvalid={errors.password}>
            <FormLabel
              htmlFor="password"
              fontSize={{ base: "14px", md: "16px", xl: "16px" }}
              fontWeight={{ base: "600", md: "500", xl: "500" }}
            >
              Password
              <chakra.span aria-label="Required" color="r400">
                {" "}
                *
              </chakra.span>
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
                onFocus={() => setFocused({ ...focused, password: true })}
                onBlur={() => setFocused({ ...focused, password: false })}
                aria-required="true"
                id="password"
                name="password"
                autoComplete="off"
                type={visible.password ? "text" : "password"}
                variant="primary"
                paddingInline="1rem 2.5rem"
                h="42px"
              />
              {visible.password ? (
                <Icon
                  as={MdOutlineVisibilityOff}
                  onClick={() =>
                    toggleVisibility({ ...visible, password: false })
                  }
                  position="absolute"
                  right="0.875rem"
                  cursor="pointer"
                  zIndex="1"
                  color={
                    focused.password && (colorMode === "dark" ? "p500" : "g500")
                  }
                />
              ) : (
                <Icon
                  as={MdOutlineVisibility}
                  onClick={() =>
                    toggleVisibility({ ...visible, password: true })
                  }
                  position="absolute"
                  right="0.875rem"
                  cursor="pointer"
                  zIndex="1"
                  color={
                    focused.password && (colorMode === "dark" ? "p500" : "g500")
                  }
                />
              )}
            </HStack>
            <Progress
              variant={passwordStrength >= 80 ? "highStrength" : "lowStrength"}
              mt="6px"
              size="xs"
              borderRadius="1rem"
              value={passwordStrength}
            />
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
            mb="10px !important"
          >
            <FormLabel
              htmlFor="conPassword"
              fontSize={{ base: "14px", md: "16px", xl: "16px" }}
              fontWeight={{ base: "600", md: "500", xl: "500" }}
            >
              Confirm Password
              <chakra.span aria-label="Required" color="r400">
                {" "}
                *
              </chakra.span>
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
                      setErrorHandler({ ...errorHandler, confirmation: false });
                  },
                })}
                onFocus={() => setFocused({ ...focused, confirm: true })}
                onBlur={() => setFocused({ ...focused, confirm: false })}
                aria-required="true"
                id="conPassword"
                name="conPassword"
                autoComplete="off"
                type={visible.confirm ? "text" : "password"}
                variant="primary"
                paddingInline="1rem 2.5rem"
                h="42px"
              />
              {visible.confirm ? (
                <Icon
                  as={MdOutlineVisibilityOff}
                  onClick={() =>
                    toggleVisibility({ ...visible, confirm: false })
                  }
                  position="absolute"
                  right="0.875rem"
                  cursor="pointer"
                  zIndex="1"
                  color={
                    focused.confirm && (colorMode === "dark" ? "p500" : "g500")
                  }
                />
              ) : (
                <Icon
                  as={MdOutlineVisibility}
                  onClick={() =>
                    toggleVisibility({ ...visible, confirm: true })
                  }
                  position="absolute"
                  right="0.875rem"
                  cursor="pointer"
                  zIndex="1"
                  color={
                    focused.confirm && (colorMode === "dark" ? "p500" : "g500")
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

        <FormControl isInvalid={errorHandler.phoneInUse}>
          <FormLabel
            htmlFor="phone"
            fontSize={{ base: "14px", md: "16px", xl: "16px" }}
            fontWeight={{ base: "600", md: "500", xl: "500" }}
          >
            Phone
          </FormLabel>
          <HStack>
            <Select
              {...register("callingCode", {
                required: watch("phone").length ? true : false,
              })}
              aria-label="Calling Codes"
              aria-required="false"
              id="callingCode"
              name="callingCode"
              variant="primary"
              maxW="117px"
              borderRightRadius="0"
              h="42px"
            >
              {COUNTRIES.map((detail, i) => (
                <option key={i} value={detail.callingCode}>
                  {detail.code}: {detail.callingCode}
                </option>
              ))}
            </Select>
            <Input
              {...register("phone", {
                required: false,
                maxLength: {
                  value: 15,
                  message: "Max of 15 characters exceeded.",
                },
                onChange: (e) => {
                  handlePhoneFormat(e);
                  handlePhoneErrorMsg(e);
                },
              })}
              value={inputValue}
              aria-required="false"
              id="phone"
              name="phone"
              maxLength="14"
              autoComplete="off"
              variant="primary"
              m="0 !important"
              borderLeftRadius="0"
              h="42px"
            />
          </HStack>
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
          {errorMsg.length ? (
            <FormErrorMessage>{errorMsg}</FormErrorMessage>
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
    </ModalTemplate>
  );
};

export default RegisterModal;
