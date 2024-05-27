export class ApiError extends Error {
  from: string;
  statusCode: number;

  constructor(message: string, from: string, statusCode: number = 500) {
    super(message);
    this.from = from;
    this.statusCode = statusCode;
  }
}

/**
 * Use for 'critical' errors.
 */
export function createApiError(err: any, from: string, statusCode?: number) {
  return err instanceof ApiError
    ? err
    : new ApiError(err.message, from, statusCode);
}
