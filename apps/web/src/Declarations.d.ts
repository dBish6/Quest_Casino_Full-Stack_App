import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface Window {
  __PRELOADED_STATE__: any;
}

declare module "@reduxjs/toolkit/query" {
  interface FetchBaseQueryError {
    status: number
    data?: {
      message: string;
      ERROR?: string;
    };
  }
}
