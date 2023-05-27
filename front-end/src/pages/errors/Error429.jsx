// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

// *Design Imports*
import { Text, chakra } from "@chakra-ui/react";

const Error429 = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <Text fontSize="18px" mt="2rem">
      <chakra.span fontSize="1.5rem" fontWeight="600" color="r500">
        Error 429:
      </chakra.span>{" "}
      Too many requests have been made to the server, the entire site maybe on
      lockdown for you. You can try refreshing to the home page, but if this
      persists, come back in an hour.
    </Text>
  );
};

export default Error429;
