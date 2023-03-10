import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Custom Hooks Import*
import useAuth from "../../../../hooks/useAuth";

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
  useColorMode,
} from "@chakra-ui/react";
import { CgDollar } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

// *API Services Imports*
import UpdateProfile from "../../api_services/UpdateProfile";

// *Component Imports*
import ModalBackdrop from "../../../../components/modals/ModalBackdrop";
import Header from "../../../../components/Header";

// *Animations*
const model = {
  visible: {
    y: "-50%",
    x: "-50%",
    opacity: 1,
    transition: {
      y: { type: "spring", stiffness: 50 },
      opacity: { duration: 0.8 },
    },
  },
  hidden: {
    y: "-400%",
    x: "-50%",
    opacity: 0,
    transition: {
      duration: 0.8,
      type: "tween",
    },
  },
};

const CashInModal = (props) => {
  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      cash: "",
    },
  });
  const { handleUpdateBalance, loadingUpdate, errorHandler } = UpdateProfile();
  const formRef = useRef(null);

  useEffect(() => {
    if (props.show) {
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 810);
    }
  }, [props.show]);

  return (
    <>
      <AnimatePresence initial={false}>
        {props.show && (
          <>
            <ModalBackdrop
              show={props.show}
              setShow={props.setShow}
              type={typeof props.setShow === "object" ? "cashIn" : ""}
            />

            <Container
              as={motion.div}
              variants={model}
              animate="visible"
              initial="hidden"
              exit="hidden"
              key="modal"
              zIndex="modal"
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
                    ? props.setShow({ cashIn: false })
                    : props.setShow(false)
                }
                variant="exit"
                position="absolute"
                top="-8px"
                right="-8px"
              >
                &#10005;
              </Button>
              <Header fontSize="2rem" mb="1.5rem" text="Cash In" />

              <chakra.form
                onSubmit={handleSubmit(() =>
                  handleUpdateBalance(formRef, currentUser.uid, watch("cash"))
                )}
                ref={formRef}
              >
                {errorHandler.unexpected ? (
                  <Alert status="error" variant="left-accent">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Server Error 500</AlertTitle>
                      <AlertDescription>Failed to send cash.</AlertDescription>
                    </Box>
                  </Alert>
                ) : undefined}

                <FormControl isInvalid={errors.cash}>
                  <FormLabel htmlFor="cash">
                    Amount<chakra.span color="r400"> *</chakra.span>
                  </FormLabel>
                  <HStack>
                    <Icon
                      as={CgDollar}
                      position="absolute"
                      left="0.5rem"
                      color="g500"
                    />
                    <Input
                      {...register("cash", {
                        required: "Enter a value of how much to deposit.",
                        maxLength: {
                          value: 5,
                          message: "Please don't deposit more then $10,000!",
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Please enter a number.",
                        },
                      })}
                      name="cash"
                      autoComplete="off"
                      variant="primary"
                      h="52px"
                      marginInlineStart="0px !important"
                      paddingInline="1.5rem 1rem"
                    />
                  </HStack>
                  <ErrorMessage
                    errors={errors}
                    name="cash"
                    render={({ message }) => (
                      <FormErrorMessage>{message}</FormErrorMessage>
                    )}
                  />
                </FormControl>

                <Button
                  isLoading={loadingUpdate.balance ? true : false}
                  type="submit"
                  variant="primary"
                  mt="1.5rem"
                  w="100%"
                >
                  Deposit
                </Button>
              </chakra.form>
            </Container>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CashInModal;
