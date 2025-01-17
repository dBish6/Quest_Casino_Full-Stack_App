export interface LoginBodyDto {
  email: string;
  password: string;
}

export interface LoginGoogleBodyDto {
  code: string;
  state: string;
  secret?: string;
  redirect_uri: string;
}
