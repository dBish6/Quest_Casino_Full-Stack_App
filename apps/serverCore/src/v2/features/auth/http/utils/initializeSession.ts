import type { Response } from "express";
import type { Identifier } from "@authFeat/services/authService";
import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";
import type { GetUserBy, User as UserFields, UserToClaims, RegistrationTypes } from "@authFeat/typings/User";

import { handleHttpError } from "@utils/handleError";

import { User } from "@authFeat/models";

import { populateUserDoc } from "@authFeat/services/authService";
import { GenerateUserJWT } from "@authFeat/services/jwtService";
import { deleteCsrfToken, generateCsrfToken } from "@authFeatHttp/services/csrfService";

/**
 * Initializes a user session by generating and setting JWT access and refresh tokens as cookies,
 * replaces the old CSRF token if it exists with a new one.
 * @param res Express response object.
 * @param identifier Object containing user get by and value.
 * @param csrfToken Replaces the current user's csrf token with a new one.
 * @returns client formatted user.
 */
export default async function initializeSession(
  res: Response,
  identifier: Identifier<GetUserBy>,
  csrfToken: string | undefined
) {
  try {
    const userQuery = User.findOne({ [identifier.by]: identifier.value }),
      user = await userQuery.exec();
    if (!user) return "Couldn't find the user while session initialization.";

    const userToClaims = formatUserToClaims(user),
      generateUserJWT = new GenerateUserJWT(userToClaims);

    const accessToken = generateUserJWT.accessToken(),
      [refreshToken, newCsrfToken] = await Promise.all([
        generateUserJWT.refreshToken(),
        generateCsrfToken(user.id),
      ]);

    if (csrfToken) deleteCsrfToken(user.id, csrfToken);

    // TODO: Try sameSite strict since it is same origin?
    res
      .cookie("session", accessToken, {
        path: "/",
        maxAge: 1000 * 60 * 15, // 15 minutes.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .cookie("refresh", refreshToken, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week.
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .setHeader("x-xsrf-token", newCsrfToken);

    const clientUser = await populateUserDoc(userQuery.clone()).client().populate("friends");
    clientUser!.friends = ({ pending: {}, list: {} }) as UserFields["friends"];
    return (clientUser! as unknown) as UserCredentials;
  } catch (error: any) {
    throw handleHttpError(error, "initializeSession error.");
  }
}

function formatUserToClaims(user: UserFields): UserToClaims {
  return {
    _id: user._id,
    type: user.type as RegistrationTypes,
    legal_name: user.legal_name,
    username: user.username,
    email: user.email,
    verification_token: user.verification_token,
    country: user.country,
    region: user.region,
    phone_number: user.phone_number,
  };
}
