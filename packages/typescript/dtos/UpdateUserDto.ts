import { UserCredentials } from "../typings/UserCredentials";

export interface UpdateProfileBodyDto {
  avatar_url?: string;
  legal_name?: { first: string; last: string };
  username?: string;
  bio?: string;

  email?: string;
  // password: string;

  country: string;
  region?: string;
  phone_number?: string;
}

export interface UpdateProfileResponseDto {
  user: UserCredentials;
  refreshed: boolean;
}

export type FavouriteOperations = "delete" | "add";
export interface UpdateUserFavouritesBodyDto {
  favourites: { op: "delete" | "add"; title: string }[];
}

export interface ResetPasswordBodyDto {
  old: string;
  new: string;
}
