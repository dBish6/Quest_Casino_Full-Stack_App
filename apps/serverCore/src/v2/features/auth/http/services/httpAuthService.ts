/**
 * HTTP Auth Service
 *
 * Description:
 * Handles HTTP-related functionalities related to user authentication and management.
 */

import type { ObjectId } from "mongoose";
import type { InitializeUser, UserNotification, UserNotificationField } from "@authFeat/typings/User";
import type { Notification } from "@qc/typescript/dtos/NotificationsDto";

import { Types, startSession  } from "mongoose";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { logger } from "@qc/utils";
import { handleHttpError, HttpError } from "@utils/handleError";
import sendEmail from "@utils/sendEmail";

import { User, UserFriends, UserStatistics, UserActivity, UserNotifications } from "@authFeat/models";
import { PrivateChatMessage } from "@chatFeat/models";
import { redisClient } from "@cache";

import { MINIMUM_USER_FIELDS, updateUserCredentials } from "@authFeat/services/authService";
import { clearAllSessions } from "@authFeat/services/jwtService";
import { deleteAllCsrfTokens } from "./csrfService";

/**
 * Registers a new user in the database.
 */
export async function registerUser(user: InitializeUser) {
  const userId = new Types.ObjectId(),
    verificationToken = randomUUID()

  try {
    await redisClient.set(`user:${userId}:verification_token`, verificationToken);

    if (user.password && user.type === "standard") user.password = await hash(user.password, 12);
    else user.password = `${user.type} provided`;

    const session = await startSession();

    await session.withTransaction(async () => {
      const docs = [
        new User({
          _id: userId,
          legal_name: { first: user.first_name, last: user.last_name },
          verification_token: verificationToken,
          friends: userId,
          statistics: userId,
          activity: userId,
          notifications: userId,
          ...user,
        }),
        new UserFriends({ _id: userId }),
        new UserStatistics({ _id: userId }),
        new UserActivity({ _id: userId }),
        new UserNotifications({ _id: userId }),
        new PrivateChatMessage({ _id: userId })
      ];
      for (const doc of docs) await doc.save({ session });
    }).finally(() => session.endSession());

    logger.info(`User ${userId} was successfully registered in the database.`);
  } catch (error: any) {
    throw handleHttpError(error, "registerUser service error.");
  }
}

/**
 * Verifies the user's verification token that was used to create the unique verification link
 * and returns the verified user.
 * @throws `HttpError 403` verification token disparity.
 * @throws `HttpError 404` user not found.
 */
export async function emailVerify(userId: string, verificationToken: string) {
  try {
    const cachedToken = await redisClient.get(`user:${userId}:verification_token`);
    if (verificationToken !== cachedToken) 
      throw new HttpError("Verification token disparity.", 403);

    const clientUser = await updateUserCredentials(
      {
        by: "verification_token",
        value: verificationToken
      },
      {
        $set: { email_verified: true },
      },
      { new: true, forClient: true }
    )
    await redisClient.del(`user:${userId}:verification_token`);
    
    return clientUser;
  } catch (error: any) {
    throw handleHttpError(error, "emailVerify service error.");
  }
}
/**
 * Sends an email with a verification link to the specified email address.
 * @throws `HttpError 541` SMTP rejected.
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
        resolve(__dirname, "../../../../emails/partials/footer.html"),
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
      throw new HttpError(
        "Your email was rejected by our SMTP server during sending. Please consider using a different email address. If the issue persists, feel free to reach out to support.",
        541
      );
  } catch (error: any) {
    throw handleHttpError(error, "sendVerifyEmail service error.");
  }
}

/**
 * Searches for users in the database based on a username.
 */
export async function searchUsers(username: string) {
  try {
    return await User.find({
      username: { $regex: username, $options: "i" }
    }).select(MINIMUM_USER_FIELDS).limit(50);
  } catch (error: any) {
    throw handleHttpError(error, "searchUsers service error.");
  }
}

/**
 * Gets all notifications of a user from the database sorted by created_at, categorized or un-categorized.
 */
export async function getSortedUserNotifications(
  userId: ObjectId | string,
  categorize = true
): Promise<{ notifications: UserNotificationField } | { notifications: UserNotification[] }> {
  let result
  
  try {
    if (categorize) {
      result = await UserNotifications.aggregate([
        { $match: { _id: new Types.ObjectId(userId as string) } },
        {
          $facet: {
            news: [
              { $unwind: "$notifications.news" },
              { $sort: { "notifications.news.created_at": -1 } },
              { $project: { notification: "$notifications.news" } }
            ],
            system: [
              { $unwind: "$notifications.system" },
              { $sort: { "notifications.system.created_at": -1 } },
              { $project: { notification: "$notifications.system" } }
            ],
            general: [
              { $unwind: "$notifications.general" },
              { $sort: { "notifications.general.created_at": -1 } },
              { $project: { notification: "$notifications.general" } }
            ]
          }
        },
        {
          $project: {
            notifications: {
              news: "$news.notification",
              system: "$system.notification",
              general: "$general.notification",
            }
          }
        }
      ]);
    } else {
      result = await UserNotifications.aggregate([
        { $match: { _id: new Types.ObjectId(userId as string) } },
        {
          $project: {
            notifications: {
              $concatArrays: [
                "$notifications.news",
                "$notifications.system",
                "$notifications.general"
              ]
            }
          }
        },
        { $unwind: "$notifications" },
        { $sort: { "notifications.created_at": -1 } },
        { $group: { _id: 0, notifications: { $push: "$notifications" } } }
      ])
    }

    return result.length > 0 ? result[0] : { notifications: { news: [], system: [], general: [] } };
  } catch (error: any) {
    throw handleHttpError(error, "getUserNotifications service error.");
  }
}

/**
 * Delete one or multiple notifications of a user from the database.
 */
export async function deleteUserNotifications(
  userId: ObjectId | string,
  notifications: Notification[],
  categorize?: boolean
) {
  try {
    if (notifications.length > 1) {
      await UserNotifications.bulkWrite(
        notifications.map((toDelete) => ({
          updateOne: {
            filter: { _id: userId },
            update: {
              $pull: {
                [`notifications.${toDelete.type}`]: { notification_id: toDelete.notification_id },
              },
            },
          },
        }))
      );
    } else {
      const toDelete = notifications[0];
      await UserNotifications.findOneAndUpdate(
        { _id: userId },
        { $pull: { [`notifications.${toDelete.type}`]: { notification_id: toDelete.notification_id } } },
      );
    }

    return getSortedUserNotifications(userId, categorize);
  } catch (error: any) {
    throw handleHttpError(error, "deleteUserNotifications service error.");
  }
}

// /**
//  * Updates the user's profile details based on the client edit
//  */
// // TODO:
// export async function updateProfile(userId: ObjectId | string) {
//   try {
//     // await User.findOneAndUpdate(
//     //   { _id: userId },
//     //
//     //   { runValidators: true }
//     // );
//   } catch (error: any) {
//     throw handleApiError(error, "updateUser service error.", 500);
//   }
// }

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
    throw handleHttpError(error, "deleteUser service error.");
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
    throw handleHttpError(error, "deleteUser service error.");
  }
}
