import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Custom Hooks Import*
import useAuth from "../../../hooks/useAuth";

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
  Heading,
  Link,
  Button,
  //   Box,
  HStack,
} from "@chakra-ui/react";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";

// *API Services Imports*
import PostRegister from "../api_services/PostRegister";

const RegisterModel = () => {
  const [visible1, toggleVisibility1] = useState(false);
  const [visible2, toggleVisibility2] = useState(false);
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
  // const { currentUser } = useAuth();
  const { handleRegister, errorHandler, setErrorHandler, loading } =
    PostRegister();

  // console.log(watch());
  return (
    <chakra.form
      onSubmit={handleSubmit(() =>
        handleRegister(
          watch("firstName"),
          watch("lastName"),
          watch("username"),
          watch("email"),
          watch("password"),
          watch("conPassword"),
          watch("phone")
        )
      )}
    >
      <Heading fontSize="2xl" mb="4" textAlign="center">
        Register
      </Heading>

      {errorHandler.unexpected ? (
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          <Box>
            <AlertTitle>Unexpected Error!</AlertTitle>
            <AlertDescription>
              Failed to create account, please try again.
            </AlertDescription>
          </Box>
        </Alert>
      ) : errorHandler.maxRequests ? (
        <Alert status="error" variant="left-accent">
          <AlertIcon />
          Max request reached, please try again later.
        </Alert>
      ) : undefined}

      <HStack>
        <FormControl isInvalid={errors.firstName}>
          <FormLabel htmlFor="firstName">
            First Name<chakra.span color="r400"> *</chakra.span>
          </FormLabel>
          <Input
            {...register("firstName", {
              required: "First name is required.",
              maxLength: 50,
            })}
            name="firstName"
            autoComplete="off"
            h="52px"
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
              maxLength: 50,
            })}
            name="lastName"
            autoComplete="off"
            h="52px"
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

      <FormControl isInvalid={errors.username}>
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
              value: 2,
              message: "You can make a better username then that...",
            },
          })}
          name="username"
          autoComplete="off"
          h="52px"
        />
        <ErrorMessage
          errors={errors}
          name="username"
          render={({ message }) => (
            <FormErrorMessage>{message}</FormErrorMessage>
          )}
        />
      </FormControl>

      <FormControl isInvalid={errors.email || errorHandler.emailInUse}>
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
          })}
          name="email"
          autoComplete="off"
          h="52px"
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
            Email is already used by a Quest user.
          </FormErrorMessage>
        ) : undefined}
      </FormControl>

      <FormControl isInvalid={errors.password}>
        <FormLabel htmlFor="password">
          Password<chakra.span color="r400"> *</chakra.span>
        </FormLabel>
        <Input
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters.",
            },
          })}
          name="password"
          type={visible1 ? "text" : "password"}
          h="52px"
        />
        {visible1 ? (
          <Icon
            as={MdOutlineVisibilityOff}
            onClick={() => toggleVisibility1(false)}
          />
        ) : (
          <Icon
            as={MdOutlineVisibility}
            onClick={() => toggleVisibility1(true)}
          />
        )}
        <ErrorMessage
          errors={errors}
          name="password"
          render={({ message }) => (
            <FormErrorMessage>{message}</FormErrorMessage>
          )}
        />
      </FormControl>

      <FormControl isInvalid={errors.conPassword || errorHandler.confirmation}>
        <FormLabel htmlFor="conPassword">
          Password Confirmation<chakra.span color="r400"> *</chakra.span>
        </FormLabel>
        <Input
          {...register("conPassword", {
            required: "Please confirm your password.",
            onChange: (e) => {
              if (e.target.value === watch("password"))
                setErrorHandler({ confirmation: false });
            },
          })}
          name="conPassword"
          type={visible2 ? "text" : "password"}
          h="52px"
        />
        {visible2 ? (
          <Icon
            as={MdOutlineVisibilityOff}
            onClick={() => toggleVisibility2(false)}
          />
        ) : (
          <Icon
            as={MdOutlineVisibility}
            onClick={() => toggleVisibility2(true)}
          />
        )}
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

      <FormControl isInvalid={errorHandler.phoneInUse}>
        <FormLabel htmlFor="phone">Phone</FormLabel>
        <Input
          {...register("phone", {
            required: false,
          })}
          name="phone"
          autoComplete="off"
          h="52px"
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

      {/* TODO: Disable button when loading. */}
      <Button disabled={loading ? true : false} type="submit">
        Sign Up
      </Button>
    </chakra.form>
  );
};

export default RegisterModel;
