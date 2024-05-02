// import s from "./errors.module.css";

export default function Error500() {
  return (
    <div>
      <h2>
        <span>Error 500:</span> Internal Server Error
      </h2>
      <p>Unexpected server error or couldn't establish a connection.</p>
    </div>
  );
}
