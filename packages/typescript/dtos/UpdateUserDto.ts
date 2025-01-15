import { UserCredentials } from "../typings/UserCredentials";

export interface UpdateUserSettingsDto extends Omit<Partial<UserCredentials["settings"]>, "blocked_list"> {
  blocked_list: { op: "delete" | "add"; member_id: string }[];
};
export interface UpdateProfileBodyDto {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  email?: string;
  country?: string;
  region?: string;
  phone_number?: string;
  settings?: UpdateUserSettingsDto;
}

export interface UpdateProfileResponseDto {
  user: Partial<UserCredentials & { email: string }>;
  refreshed?: string;
  /** When they block a user that in their friends list. */
  unfriended?: boolean;
}

export type FavouriteOperations = "delete" | "add";
export interface UpdateUserFavouritesBodyDto {
  favourites: { op: "delete" | "add"; title: string }[];
}

export type SendConfirmPasswordEmailBodyDto =
  | { password: { old: string; new: string } }
  | { password: string; verification_token: string };
