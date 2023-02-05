import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Heading,
  Icon,
  Link,
  Button,
  Text,
  Box,
  HStack,
} from "@chakra-ui/react";

const PasswordResetModel = () => {
  const [loading, toggleLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [unexpectedErr, setUnexpectedErr] = useState("");
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
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const firebasePostReset = async () => {
    try {
      toggleLoading(true);

      setUnexpectedErr("");
      const res = await resetPassword(watch("email"));
      res && console.log(res);
      if (res)
        setSuccessMsg("Check your email inbox for further instructions.");
    } catch (error) {
      setUnexpectedErr("Failed to reset email.");
      console.error(error);
    }
    toggleLoading(false);
  };

  console.log(watch());
  return (
    <chakra.form
      onSubmit={handleSubmit(() => firebasePostReset())}
      justifySelf="center"
    >
      <Heading fontSize="2xl" mb="4" textAlign="center">
        Reset Password
      </Heading>
      {successMsg.length ? (
        <Alert status="success" variant="left-accent">
          <AlertIcon />
          {successMsg}
        </Alert>
      ) : undefined}
      <FormControl isInvalid={errors.email || unexpectedErr}>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          {...register("email", {
            required: "Email is required.",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address." },
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
        {unexpectedErr.length ? (
          <FormErrorMessage>{unexpectedErr}</FormErrorMessage>
        ) : undefined}
      </FormControl>

      <Button disabled={loading ? true : false} type="submit">
        Reset
      </Button>
      <Link onClick={() => navigate(-1)}>Go Back</Link>
    </chakra.form>
  );
};

export default PasswordResetModel;
