import React from "react";

// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Favorites = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);
  return <div>Favorites</div>;
};

export default Favorites;
