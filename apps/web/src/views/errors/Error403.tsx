import { Link } from "@components/common";

export default function Error403() {
  return (
    <div>
      <h2>
        <span>Error 403:</span> Forbidden
      </h2>
      <p>
        User authorization or CSRF token is not valid. Please try to{" "}
        <Link intent="primary" to="/?login=true">
          log in
        </Link>{" "}
        again.
      </p>
    </div>
  );
}
