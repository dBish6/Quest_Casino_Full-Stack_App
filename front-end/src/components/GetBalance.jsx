// *Design Imports*
import { chakra, useToast } from "@chakra-ui/react";

// *API Services Imports*
import GetUserBalance from "../features/authentication/api_services/GetUserBalance";

// *Redux Imports*
import { useSelector } from "react-redux";
import { selectWallet } from "../features/games/blackjack/redux/blackjackSelectors";

const GetBalance = (props) => {
  const wallet = useSelector(selectWallet);
  const { fsUserBalance, notFoundErr, loading } = GetUserBalance(
    props.currentUser.uid,
    false,
    wallet
  );
  const toast = useToast();

  return (
    <>
      {notFoundErr.length
        ? toast({
            description: `Server Error 404: ${notFoundErr}`,
            status: "error",
            duration: 99999999,
            isClosable: true,
            position: "top",
            variant: "solid",
          })
        : undefined}
      {!loading && (
        <>
          Balance:{" "}
          <chakra.span
            color={notFoundErr.length ? "r500" : "g500"}
            fontWeight="500"
          >
            {wallet === null
              ? `$${fsUserBalance}`
              : notFoundErr.length
              ? "Error"
              : `$${wallet}`}
          </chakra.span>
        </>
      )}
    </>
  );
};

export default GetBalance;
