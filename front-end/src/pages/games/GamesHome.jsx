// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

// *Feature Import*

const GamesHome = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);
  return (
    <div>
      GamesHome <a href="/games/blackjack">Blackjack</a>
    </div>
  );
};

export default GamesHome;
