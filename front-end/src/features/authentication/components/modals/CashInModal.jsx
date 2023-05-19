import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

// *Custom Hooks Import*
import useAuth from "../../../../hooks/useAuth";

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
  Button,
  HStack,
} from "@chakra-ui/react";
import { CgDollar } from "react-icons/cg";

// *Custom Hooks Import*
import useDisableScroll from "../../../../hooks/useDisableScroll";

// *API Services Import*
import UpdateProfile from "../../api_services/UpdateProfile";

// *Component Imports*
import ModalTemplate from "../../../../components/modals/ModalTemplate";
import MyHeading from "../../../../components/MyHeading";

const CashInModal = (props) => {
  const { currentUser, csrfToken, balance, setBalance } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      deposit: "",
    },
  });
  const { handleUpdateBalance, loadingUpdate, errorHandler } = UpdateProfile();
  const formRef = useRef(null);

  useDisableScroll(
    typeof props.show === "object" ? props.show.cashIn : props.show,
    810
  );

  return (
    <ModalTemplate
      show={typeof props.show === "object" ? props.show.cashIn : props.show}
      setShow={props.setShow}
      objName={typeof props.show === "object" && "cashIn"}
      animation={{ type: "down", y: "-400%" }}
      maxW="325px"
    >
      <Button
        onClick={() =>
          typeof props.show === "object"
            ? props.setShow({ ...props.show, cashIn: false })
            : props.setShow(false)
        }
        variant="exit"
        position="absolute"
        top="-8px"
        right="-8px"
      >
        &#10005;
      </Button>
      <MyHeading fontSize="2rem" mb="1.5rem" text="Cash In" />

      <chakra.form
        onSubmit={handleSubmit(() =>
          handleUpdateBalance(
            formRef,
            currentUser.uid,
            watch("deposit"),
            balance,
            setBalance,
            csrfToken
          )
        )}
        ref={formRef}
      >
        {errorHandler.unexpected ? (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            <Box>
              <AlertTitle>Server Error 500</AlertTitle>
              <AlertDescription>Failed to send deposit.</AlertDescription>
            </Box>
          </Alert>
        ) : undefined}

        <FormControl isInvalid={errors.deposit}>
          <FormLabel htmlFor="deposit" opacity={currentUser === null && "0.4"}>
            Amount<chakra.span color="r400"> *</chakra.span>
          </FormLabel>
          <HStack>
            <Icon
              as={CgDollar}
              position="absolute"
              left="0.5rem"
              color="g500"
              opacity={currentUser === null && "0.4"}
            />
            <Input
              {...register("deposit", {
                required: "Enter a value of how much to deposit.",
                min: {
                  value: 5,
                  message: "Please deposit at least $5.",
                },
                maxLength: {
                  value: 5,
                  message: "Please don't deposit more then $10,000!",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a number.",
                },
              })}
              id="deposit"
              name="deposit"
              autoComplete="off"
              isDisabled={currentUser === null}
              variant="primary"
              h="48px"
              marginInlineStart="0px !important"
              paddingInline="1.5rem 1rem"
              cursor={currentUser === null && "not-allowed"}
            />
          </HStack>
          <ErrorMessage
            errors={errors}
            name="deposit"
            render={({ message }) => (
              <FormErrorMessage>{message}</FormErrorMessage>
            )}
          />
        </FormControl>

        <Button
          isLoading={loadingUpdate.balance ? true : false}
          isDisabled={currentUser === null}
          type="submit"
          variant="primary"
          mt="1.5rem"
          w="100%"
        >
          Deposit
        </Button>
      </chakra.form>
    </ModalTemplate>
  );
};

export default CashInModal;
