// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

// *Design Imports*
import { Text, chakra } from "@chakra-ui/react";

const Error404 = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <Text fontSize="18px" mt="2rem">
      <chakra.span fontSize="1.5rem" fontWeight="600" color="r500">
        Error 404:
      </chakra.span>{" "}
      Page not found.
    </Text>
  );
};

export default Error404;
