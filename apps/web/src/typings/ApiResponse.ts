// export interface SuccessResponse {
//   message: string;
//   [key: string]: any;
// }

export type HttpResponse<TData extends object = {}> = {
  message: string;
} & TData;

// export type HttpResponse<TSucData extends object = {}> =
//   | SuccessResponse<TSucData>
//   | ErrorResponse;

export interface ErrorHttpResponse {
  message?: string;
  ERROR: string | Record<string, string>;
  allow?: boolean;
}

export type SocketResponse<TData extends object = {}> = HttpResponse & {
  status: string;
} & TData;

export interface ErrorSocketResponse extends SocketResponse {
  ERROR: string;
}
