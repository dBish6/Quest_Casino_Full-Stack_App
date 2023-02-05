// *Custom Hooks Import*
import useDocumentTitle from "../hooks/useDocumentTitle";

const About = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return <div>About Us</div>;
};

export default About;
