import type { RegisterGoogleBodyDto } from "@qc/typescript/dtos/RegisterBodyDto";
import type { InitializeUser } from "@authFeat/typings/User";

import querystring from "querystring";

import USER_ALREADY_EXISTS_MESSAGE from "@authFeat/constants/USER_ALREADY_EXISTS_MESSAGE";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";
import { getUser, registerUser } from "./authService";

interface FetchAccessTokenSuccessDataDto {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface FetchUserInfoSuccessDataDto {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

/**
 * Registers a user using Google OAuth.
 */
export async function registerGoogleUser(body: RegisterGoogleBodyDto) {
  try {
    const { code, redirect_uri, password } = body;

    const token = await fetchAccessTokenToken(code, redirect_uri),
      userInfo = await fetchUserInfo(token);

    const { name, given_name, family_name, picture, email, email_verified } =
      userInfo;

    const user = await getUser("email", email);
    if (user) {
      return USER_ALREADY_EXISTS_MESSAGE;
    } else {
      const regUser: InitializeUser = {
        type: "google",
        avatar_url: picture,
        first_name: given_name,
        last_name: family_name,
        username: name,
        email,
        email_verified,
        password,
        country: "Canada", // TODO: Prompt user to enter this or just default it and tell them in a toast?
      };

      await registerUser(regUser);
    }
  } catch (error: any) {
    throw createApiError(error, "register service error.", 500);
  }
}

async function fetchAccessTokenToken(code: string, redirectUri: string) {
  try {
    const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env;
    console.log("GOOGLE_OAUTH_CLIENT_ID", GOOGLE_OAUTH_CLIENT_ID);

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify({
          code,
          client_id: GOOGLE_OAUTH_CLIENT_ID,
          client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
          redirect_uri: redirectUri, // This is just to ensure the request is valid.
          grant_type: "authorization_code",
        }),
      }),
      data = (await res.json()) as FetchAccessTokenSuccessDataDto;

    logger.debug("fetchIdToken res", res);
    logger.debug("fetchIdToken data", data);

    if (!res.ok)
      throw createApiError(
        Error("Received a bad status from token request."),
        "fetchUserInfo error.",
        403
      );

    return data.access_token;
  } catch (error) {
    throw createApiError(error, "fetchIdToken error.", 500);
  }
}

async function fetchUserInfo(token: string) {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      data = (await res.json()) as FetchUserInfoSuccessDataDto;

    if (!res.ok)
      throw createApiError(
        new Error("Failed to fetch user info"),
        "fetchUserInfo error",
        500
      );

    logger.debug("fetchUserInfo res", res);
    logger.debug("fetchUserInfo data", data);

    return data;
  } catch (error) {
    throw createApiError(error, "fetchUserInfo error.", 500);
  }
}
