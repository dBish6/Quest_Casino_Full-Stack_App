import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useToast } from "@chakra-ui/react";

// For routes that you need to be signed in for.
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  // FIXME: When the user logs out.
  !currentUser &&
    toast({
      description: "You must log in to enter this page!",
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "top",
      variant: "solid",
    });

  return currentUser ? children : <Navigate to={-1} replace={true} />;
};

export default PrivateRoute;
