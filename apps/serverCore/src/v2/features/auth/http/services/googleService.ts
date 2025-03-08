import type { Response } from "express";
import type { GoogleLoginRequestDto } from "@authFeatHttp/dtos/LoginRequestDto";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { InitializeUser } from "@authFeat/typings/User";

import querystring from "querystring";

import { logger } from "@qc/utils";
import { handleHttpError, HttpError } from "@utils/handleError";
import getCountriesMap from "@utils/getCountriesMap";
import { registerUser } from "./httpAuthService";
import initializeSession from "@authFeatHttp/utils/initializeSession";

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
  req: GoogleLoginRequestDto,
  res: Response
) {
  try {
    const { code, redirect_uri = "" } = req.body;

    const token = await fetchAccessTokenToken(code, redirect_uri),
      userInfo = await fetchUserInfo(token),
      { email, email_verified } = userInfo;

    const COUNTRIES = Array.from((await getCountriesMap().catch(() => new Map())));

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
        country: COUNTRIES.length ? COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)][0] : "Canada" // The country has to be defaulted. Since we don't have access to their country with Google, they would be prompted to change this.
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
    throw handleHttpError(error, "loginWithGoogle service error.");
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
          grant_type: "authorization_code"
        })
      }),
      data = (await res.json()) as FetchAccessTokenSuccessDataDto;
    logger.debug("google fetchAccessTokenToken", res.status);

    if (!res.ok) {
      logger.error("fetchAccessTokenToken error:", data);
      throw new HttpError("Received a bad status from google token request.", 403);
    }

    return data.access_token;
  } catch (error: any) {
    throw handleHttpError(error, "fetchIdToken error.");
  }
}

async function fetchUserInfo(token: string) {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }),
      data = (await res.json()) as FetchUserInfoSuccessDataDto;
    logger.debug("google fetchUserInfo", res.status);

    if (!res.ok)
      throw new HttpError("Failed to fetch google user info.", 403);

    return data;
  } catch (error: any) {
    throw handleHttpError(error, "fetchUserInfo error.");
  }
}
