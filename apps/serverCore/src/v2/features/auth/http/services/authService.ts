/**
 * Auth Service
 *
 * Description:
 * Handles functionalities related to user authentication and management.
 */

import type { ObjectId } from "mongoose";
import type { GetUserBy, InitializeUser } from "@authFeatHttp/typings/User";

import { Types } from "mongoose";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { logger } from "@qc/utils";
import { handleApiError } from "@utils/handleError";
import sendEmail from "@utils/sendEmail";

import { User, UserStatistics, UserActivity } from "@authFeatHttp/models";
import { redisClient } from "@cache";

import { clearAllSessions } from "./jwtService";
import { deleteAllCsrfTokens } from "./csrfService";

const CLIENT_USER_SHARED_EXCLUDE = "-_id -created_at -updated_at",
  CLIENT_USER_FIELDS = `${CLIENT_USER_SHARED_EXCLUDE} -email -verification_token -password -activity`;

function populateUser(userQuery: any, forClient?: boolean) {
  if (forClient) {
    return userQuery.select(CLIENT_USER_FIELDS).populate({
      path: "statistics",
      select: CLIENT_USER_SHARED_EXCLUDE,
    });
  } else {
    return userQuery.populate("statistics activity");
  }
}

/**
 * Gets all users from the database.
 */
export async function getUsers(forClient?: boolean) {
  try {
    let query = User.find();
    query = populateUser(query, forClient);

    return await query.exec();
  } catch (error: any) {
    throw handleApiError(error, "getUsers service error.", 500);
  }
}

/**
 * Gets a user from the database based on the specified criteria.
 */
export async function getUser(
  by: GetUserBy,
  value: ObjectId | string,
  forClient?: boolean
) {
  try {
    let query = User.findOne({ [by]: value });
    query = populateUser(query, forClient);

    return await query.exec();
  } catch (error: any) {
    throw handleApiError(error, "getUser service error.", 500);
  }
}

/**
 * Registers a new user in the database.
 */
export async function registerUser(user: InitializeUser) {
  const userId = new Types.ObjectId();
  let verificationToken = randomUUID(); // For email verification link.

  try {
    if (user.password && user.type === "standard")
      user.password = await hash(user.password, 12);
    else user.password = `${user.type} provided`;

    if (user.email_verified === false)
      await redisClient.set(
        `user:${userId}:verification_token`,
        verificationToken
      );
    else verificationToken = `/profile/${verificationToken}`;

    const newUser = new User({
        _id: userId,
        legal_name: { first: user.first_name, last: user.last_name },
        verification_token: verificationToken,
        statistics: userId,
        activity: userId,
        ...user,
      }),
      userStatistics = new UserStatistics({ _id: userId }),
      userActivity = new UserActivity({ _id: userId });

    await Promise.all([
      newUser.save(),
      userStatistics.save(),
      userActivity.save(),
    ]);

    logger.info(
      `User ${newUser._id} was successfully registered in the database.`
    );
  } catch (error: any) {
    throw handleApiError(error, "registerUser service error.", 500);
  }
}

/**
 * Verifies the user's verification token that was used to create the unique verification link
 * and returns the verified user.
 */
export async function emailVerify(userId: string, verificationToken: string) {
  try {
    const cachedToken = await redisClient.get(
      `user:${userId}:verification_token`
    );
    if (verificationToken !== cachedToken)
      return "Verification token disparity.";

    let query = User.findOneAndUpdate(
      {
        verification_token: verificationToken,
      },
      {
        email_verified: true,
        verification_token: `/profile/${verificationToken}`,
      },
      { new: true }
    );
    query = await populateUser(query, true).exec();
    if (!query) return "User doesn't exist.";

    return query;
  } catch (error: any) {
    throw handleApiError(error, "emailVerify service error.", 500);
  }
}
/**
 * Sends an email with a verification link to the specified email address.
 */
export async function sendVerifyEmail(
  email: string,
  verificationToken: string
) {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  try {
    const template = readFileSync(
        resolve(__dirname, "../emails/templates/verifyEmail.html"),
        "utf-8"
      ),
      footerPartial = readFileSync(
        resolve(__dirname, "../../../emails/partials/footer.html"),
        "utf-8"
      );

    const html = template
      .replace(
        "<!--link-->",
        `<a class="verifyLink" aria-describedby="txt" href="http://localhost:3000/about?verify=${verificationToken}">Verify Email</a`
      )
      .replace("<!--footer-->", footerPartial);

    const info = await sendEmail(email, "Email Verification", html);
    if (info.rejected.length)
      throw handleApiError(
        Error(
          "Your email was rejected by our SMTP server during sending. Please consider using a different email address. If the issue persists, feel free to reach out to support."
        ),
        "sendVerifyEmail service error.",
        541
      );
  } catch (error: any) {
    throw handleApiError(error, "sendVerifyEmail service error.", 500);
  }
}

/**
 * Updates the date of a user's activity_timestamp.
 */
export async function updateActivityTimestamp(userId: ObjectId | string) {
  try {
    // TODO:
    await UserStatistics.findOneAndUpdate(
      { _id: userId },
      { activity_timestamp: new Date() }
    );
    // await User.findOneAndUpdate(
    //   { _id: userId },
    //   { "activity.activity_timestamp": new Date() },
    //   { runValidators: true }
    // );
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.", 500);
  }
}

/**
 * ...
 */
// TODO:
export async function updateProfile(userId: ObjectId | string) {
  try {
    // await User.findOneAndUpdate(
    //   { _id: userId },
    //
    //   { runValidators: true }
    // );
  } catch (error: any) {
    throw handleApiError(error, "updateUser service error.", 500);
  }
}

/**
 * Deletes the user's refresh tokens and csrf tokens.
 */
export async function wipeUser(userId: ObjectId | string) {
  try {
    await Promise.all([
      clearAllSessions(userId.toString()),
      deleteAllCsrfTokens(userId.toString()),
    ]);
  } catch (error: any) {
    throw handleApiError(error, "deleteUser service error.", 500);
  }
}

/**
 * Deletes a user from the database and their refresh tokens.
 */
export async function deleteUser(userId: ObjectId | string) {
  try {
    await Promise.all([
      User.deleteOne({ _id: userId }),
      clearAllSessions(userId.toString()),
    ]);
  } catch (error: any) {
    throw handleApiError(error, "deleteUser service error.", 500);
  }
}
