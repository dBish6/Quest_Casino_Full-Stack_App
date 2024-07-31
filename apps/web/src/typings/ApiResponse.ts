export type HttpResponse<TData extends object = {}> = {
  message: string;
} & TData;

export interface ErrorResponse {
  message?: string;
  ERROR: string;
  allow?: boolean;
}

export type SocketResponse<TData extends object = {}> = HttpResponse & {
  status: string;
} & TData;
