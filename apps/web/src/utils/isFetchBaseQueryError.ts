import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}
