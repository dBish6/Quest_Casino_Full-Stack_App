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
}

export interface UpdateProfileResponseDto {
  user: UpdateProfileBodyDto;
  refreshed?: string;
}

export type FavouriteOperations = "delete" | "add";
export interface UpdateUserFavouritesBodyDto {
  favourites: { op: "delete" | "add"; title: string }[];
}

export type SendConfirmPasswordEmailBodyDto =
  | { password: { old: string; new: string } }
  | { password: string; verification_token: string };
