export interface LoginBodyDto {
  email_username: string;
  password: string;
}

export interface LoginGoogleBodyDto {
  code: string;
  state: string;
  secret?: string;
  redirect_uri: string;
}
