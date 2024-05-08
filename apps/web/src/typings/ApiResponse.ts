// TODO:
export interface Response<Data extends object> {
  data: Data;
  isError: boolean;
}

export interface SuccessResponse {
  data: any;
  isError: boolean;
}

export interface ErrorResponse {
  data: any;
  isError: boolean;
}
