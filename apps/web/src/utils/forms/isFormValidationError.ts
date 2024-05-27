import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

export default function isFormValidationError(error: unknown) {
  return (
    isFetchBaseQueryError(error) &&
    error.status === 400 &&
    typeof error === "object"
  );
}
