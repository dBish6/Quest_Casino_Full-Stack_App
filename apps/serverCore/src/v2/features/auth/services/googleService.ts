import type { Response } from "express";
import type { GoogleLoginRequestDto } from "@authFeat/dtos/LoginRequestDto";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { InitializeUser } from "@authFeat/typings/User";

import querystring from "querystring";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";
import { registerUser } from "./authService";
import initializeSession from "@authFeat/utils/initializeSession";

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
 * Authenticates a user using Google OAuth. Initializes the user session or registers them if
 * they don't already exist.
 */
export async function loginWithGoogle(
  res: Response,
  req: GoogleLoginRequestDto
) {
  try {
    const { code, redirect_uri = "" } = req.body;

    const token = await fetchAccessTokenToken(code, redirect_uri),
      userInfo = await fetchUserInfo(token),
      { email, email_verified } = userInfo;

    const clientUser = await initializeSession(
      res,
      { by: "email", value: email },
      req.headers["x-xsrf-token"] as string
    );
    if (typeof clientUser === "string") {
      const regUser: InitializeUser = {
        type: "google",
        avatar_url: userInfo.picture,
        first_name: userInfo.given_name,
        last_name: userInfo.family_name,
        username: userInfo.name,
        email,
        email_verified,
        password: "",
      };
      await registerUser(regUser);

      return (await initializeSession(
        res,
        { by: "email", value: email },
        req.headers["x-xsrf-token"] as string
      )) as UserCredentials;
    } else {
      return clientUser;
    }
  } catch (error: any) {
    throw createApiError(error, "loginWithGoogle service error.", 500);
  }
}

async function fetchAccessTokenToken(code: string, redirectUri: string) {
  try {
    const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env;

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
    logger.info("google fetchAccessTokenToken", res.status);

    if (!res.ok) {
      logger.error("fetchAccessTokenToken error:", data);
      throw createApiError(
        Error("Received a bad status from token request."),
        "fetchAccessTokenToken error.",
        403
      );
    }

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
    logger.info("google fetchUserInfo", res.status);

    if (!res.ok)
      throw createApiError(
        new Error("Failed to fetch user info"),
        "fetchUserInfo error",
        500
      );

    return data;
  } catch (error) {
    throw createApiError(error, "fetchUserInfo error.", 500);
  }
}
