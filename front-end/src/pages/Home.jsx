// *Custom Hooks Import*
import useDocumentTitle from "../hooks/useDocumentTitle";

// *Component Imports*
import WelcomeSection from "../components/home/WelcomeSection";

const Home = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <>
      <WelcomeSection />
    </>
  );
};

export default Home;
