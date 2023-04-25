import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Design Imports*
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  chakra,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";

// *Custom Hooks Imports*
import useDisableScroll from "../../../../hooks/useDisableScroll";

// *Component Imports*
import ModalTemplate from "../../../../components/modals/ModalTemplate";
import MyHeading from "../../../../components/MyHeading";

// *API Services Imports*
import PostResetPassword from "../../api_services/PostResetPassword";

const PasswordResetModal = (props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const formRef = useRef(null);
  const { handleReset, errorHandler, loading } = PostResetPassword();

  useDisableScroll(
    typeof props.show === "object" ? props.show.passwordReset : props.show,
    510
  );

  return (
    <ModalTemplate
      show={
        typeof props.show === "object" ? props.show.passwordReset : props.show
      }
      setShow={props.setShow}
      objName={typeof props.show === "object" && "passwordReset"}
      animation={{ type: "up", y: "200%" }}
      maxW="325px"
    >
      <Button
        onClick={() =>
          typeof props.show === "object"
            ? props.setShow({ ...props.show, passwordReset: false })
            : props.setShow(false)
        }
        variant="exit"
        position="absolute"
        top="-8px"
        right="-8px"
      >
        &#10005;
      </Button>
      <MyHeading fontSize="32px" mb="1.5rem" text="Reset Password" />

      <chakra.form
        onSubmit={handleSubmit(() => handleReset(formRef, watch("email")))}
        ref={formRef}
        justifySelf="center"
      >
        {errorHandler.unexpected ? (
          <Alert status="error" variant="left-accent" mb="0.5rem">
            <AlertIcon />
            <Box>
              <AlertTitle>Server Error 500</AlertTitle>
              <AlertDescription>Failed to reset email.</AlertDescription>
            </Box>
          </Alert>
        ) : undefined}

        <FormControl isInvalid={errors.email || errorHandler.notFound}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address.",
              },
            })}
            id="email"
            name="email"
            autoComplete="off"
            variant="primary"
            h="48px"
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <FormErrorMessage>{message}</FormErrorMessage>
            )}
          />
          {errorHandler.notFound ? (
            <FormErrorMessage>
              Quest user was not found from given email.
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
          Reset
        </Button>
      </chakra.form>
    </ModalTemplate>
  );
};

export default PasswordResetModal;
