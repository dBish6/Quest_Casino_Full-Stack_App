// *Design Imports*
import { Text } from "@chakra-ui/react";

// *Custom Hooks Import*
import useDocumentTitle from "../hooks/useDocumentTitle";

const About = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return <Text>Support Email: davidbish2002@hotmail.com</Text>;
};

export default About;
