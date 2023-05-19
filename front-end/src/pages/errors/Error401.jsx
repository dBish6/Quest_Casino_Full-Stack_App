/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

// *Design Imports*
import { Text, chakra } from "@chakra-ui/react";

// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useAuth from "../../hooks/useAuth";

// *API Services Import*
import PostLogout from "../../features/authentication/api_services/PostLogout";

const Error401 = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);
  const [handleUserLogout] = PostLogout();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser !== null) {
      handleUserLogout(false, true);
    }
  }, []);

  return (
    <Text fontSize="18px" mt="2rem">
      <chakra.span fontSize="1.5rem" fontWeight="600" color="r500">
        Error 401:
      </chakra.span>{" "}
      User is unauthorized.
    </Text>
  );
};

export default Error401;
