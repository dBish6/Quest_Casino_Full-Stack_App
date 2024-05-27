import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorResponse } from "@typings/ApiResponse";

declare global {
  interface Window {
    __PRELOADED_STATE__: any;
  }
}

declare module "@reduxjs/toolkit/query" {
  interface FetchBaseQueryError {
    status: number;
    data?: ErrorResponse;
  }
}
