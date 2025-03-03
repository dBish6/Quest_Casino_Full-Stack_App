import type { ErrorResponse } from "@typings/ApiResponse";

declare global {
  interface Window {
    __PRELOADED_STATE__: any;
  }
}

// FIXME: FetchBaseQueryError is a bastard.
declare module "@reduxjs/toolkit/query" {
  type FetchBaseQueryError = {
    status: number | string;
    data?: ErrorResponse;
    error?: string;
  };
}
