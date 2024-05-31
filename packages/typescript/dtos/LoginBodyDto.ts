export interface LoginBodyDto {
  email_username: string;
  password: string;
}

export interface LoginGoogleBodyDto {
  code: string;
  state: string;
  stored_state: string;
  redirect_uri: string;
}
