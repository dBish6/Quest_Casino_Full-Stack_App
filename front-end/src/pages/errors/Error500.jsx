// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

// *Design Imports*
import { Text, chakra } from "@chakra-ui/react";

const Error500 = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <Text fontSize="18px" mt="2rem">
      <chakra.span fontSize="1.5rem" fontWeight="600" color="r500">
        Error 500:
      </chakra.span>{" "}
      Unexpected server error.
    </Text>
  );
};

export default Error500;
