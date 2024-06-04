export interface SuccessResponse {
  message: string;
  [key: string]: any;
}

export interface ErrorResponse {
  message?: string;
  ERROR: string | Record<string, string>;
  allow?: boolean
}

export type ApiResponse = SuccessResponse | ErrorResponse;
