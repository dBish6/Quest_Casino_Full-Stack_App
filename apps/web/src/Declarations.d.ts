import type { ErrorResponse } from "@typings/ApiResponse";

declare global {
  interface Window {
    __PRELOADED_STATE__: any;
  }
}

declare module "@reduxjs/toolkit/query" {
  interface FetchBaseQueryError {
    status: number | string;
    data?: ErrorResponse;
  }
}
