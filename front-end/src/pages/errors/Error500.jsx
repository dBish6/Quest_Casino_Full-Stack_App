// *Custom Hooks Import*
import useDocumentTitle from "../../hooks/useDocumentTitle";

const Error500 = (props) => {
  useDocumentTitle(`${props.title} | Quest Casino`);

  return (
    <div className="errorContainer">
      <p>
        <span>Error 500:</span> Unexpected server error.
      </p>
    </div>
  );
};

export default Error500;
