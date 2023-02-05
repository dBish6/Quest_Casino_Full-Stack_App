// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

// *Feature Import*
import BlackjackFeature from "../../features/games/blackjack";

const Blackjack = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <>
      <BlackjackFeature />
    </>
  );
};

export default Blackjack;
