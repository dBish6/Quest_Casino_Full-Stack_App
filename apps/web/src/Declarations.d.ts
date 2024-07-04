import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ErrorHttpResponse } from "@typings/ApiResponse";

declare global {
  interface Window {
    __PRELOADED_STATE__: any;
  }
}

declare module "@reduxjs/toolkit/query" {
  interface FetchBaseQueryError {
    status: number;
    data?: ErrorHttpResponse;
  }
}
