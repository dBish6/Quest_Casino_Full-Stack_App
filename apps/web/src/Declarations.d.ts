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

declare module "react-router-dom" {
  type To = string | Partial<{
    pathname: string;
    search: string | null;
    hash: string | null;
  }>;
}
