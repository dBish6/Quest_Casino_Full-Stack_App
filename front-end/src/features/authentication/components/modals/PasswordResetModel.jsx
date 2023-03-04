import { useEffect, useRef } from "react";
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
  Container,
  useColorMode,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// *Component Imports*
import ModalBackdrop from "../../../../components/modals/ModalBackdrop";
import Header from "../../../../components/Header";

// *API Services Imports*
import PostResetPassword from "../../api_services/PostResetPassword";

// *Animations*
const model = {
  visible: {
    scale: 1.0,
    y: "-50%",
    x: "-50%",
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 50 },
    },
  },
  hidden: {
    scale: 1.0,
    y: "200%",
    x: "-50%",
    opacity: 0,
    transition: {
      y: { type: "spring", damping: 70 },
    },
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

const PasswordResetModel = (props) => {
  const { colorMode } = useColorMode();
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

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 510);
    }
  }, [props.show]);

  return (
    <AnimatePresence initial={false}>
      {props.show && (
        <>
          <ModalBackdrop
            show={props.show}
            setShow={props.setShow}
            type={typeof props.setShow === "object" ? "passwordReset" : ""}
          />

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
            maxW="325px"
            backgroundColor={colorMode === "dark" ? "bd700" : "bl400"}
            borderWidth="1px"
            borderColor={colorMode === "dark" ? "borderD" : "borderL"}
            borderRadius="6px"
          >
            <Button
              onClick={() =>
                typeof props.setShow === "object"
                  ? props.setShow({ passwordReset: false })
                  : props.setShow(false)
              }
              variant="exit"
              position="absolute"
              top="-8px"
              right="-8px"
            >
              &#10005;
            </Button>
            <Header fontSize="32px" mb="1.5rem" text="Reset Password" />

            <chakra.form
              onSubmit={handleSubmit(() =>
                handleReset(formRef, watch("email"))
              )}
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
          </Container>
        </>
      )}
    </AnimatePresence>
  );
};

export default PasswordResetModel;
