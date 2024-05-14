export class ApiError extends Error {
  from: string;
  statusCode?: number;

  constructor(from: string, message: string, statusCode: number = 500) {
    super(message);
    this.from = from;
    this.statusCode = statusCode;
  }
}

export function createApiError(
  err: any,
  from: string,
  statusCode?: number,
  message?: string
) {
  const errorMessage = message || err.message;

  return err instanceof ApiError
    ? err
    : new ApiError(from, errorMessage, statusCode);
}
