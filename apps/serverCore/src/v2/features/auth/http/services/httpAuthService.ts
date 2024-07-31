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
import { handleApiError } from "@utils/handleError";
import sendEmail from "@utils/sendEmail";

import { User, UserStatistics, UserActivity, UserNotifications } from "@authFeat/models";
import { redisClient } from "@cache";

import { MINIMUM_USER_FIELDS, updateUserCredentials } from "@authFeat/services/authService";
import { clearAllSessions } from "@authFeat/services/jwtService";
import { deleteAllCsrfTokens } from "./csrfService";

/**
 * Registers a new user in the database.
 */
export async function registerUser(user: InitializeUser) {
  const userId = new Types.ObjectId();
  let verificationToken = randomUUID(); // For the email verification link and used for the socket.io friend rooms.

  const session = await startSession();
  try {
    await session.withTransaction(async () => {
      if (user.password && user.type === "standard") user.password = await hash(user.password, 12);
      else user.password = `${user.type} provided`;

      if (!user.email_verified)
        await redisClient.set(`user:${userId}:verification_token`, verificationToken);

      const docs = [
        new User({
          _id: userId,
          legal_name: { first: user.first_name, last: user.last_name },
          verification_token: verificationToken,
          statistics: userId,
          activity: userId,
          notifications: userId,
          ...user,
        }),
        new UserStatistics({ _id: userId }),
        new UserActivity({ _id: userId }),
        new UserNotifications({ _id: userId })
      ];
      await Promise.all([docs.map((doc) => doc.save())])
    });

    logger.info(`User ${userId} was successfully registered in the database.`);
  } catch (error: any) {
    throw handleApiError(error, "registerUser service error.", 500);
  } finally {
    session.endSession();
  }
}

/**
 * Verifies the user's verification token that was used to create the unique verification link
 * and returns the verified user.
 */
export async function emailVerify(userId: string, verificationToken: string) {
  try {
    const cachedToken = await redisClient.get(`user:${userId}:verification_token`);
    if (verificationToken !== cachedToken) return "Verification token disparity.";

    const clientUser = await updateUserCredentials(
      {
        by: "verification_token",
        value: verificationToken
      },
      {
        $set: { email_verified: true },
      },
      { new: true, forClient: true }
    );
    if (!clientUser) return "User doesn't exist.";

    await redisClient.del(`user:${userId}:verification_token`);
    
    return clientUser;
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
 * Searches for users in the database based on a username.
 */
export async function searchUsers(username: string) {
  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" }
    }).select(MINIMUM_USER_FIELDS).limit(50);

    return users;
  } catch (error: any) {
    throw handleApiError(error, "searchUsers service error.", 500);
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
    throw handleApiError(error, "getUserNotifications service error.", 500);
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
    throw handleApiError(error, "deleteUserNotifications service error.", 500);
  }
}

// /**
//  * Updates the date of a user's activity_timestamp.
//  */
// export async function updateActivityTimestamp(userId: ObjectId | string) {
//   try {
//     // TODO:
//     await UserStatistics.findOneAndUpdate(
//       { _id: userId },
//       { activity_timestamp: new Date() }
//     );
//     // await User.findOneAndUpdate(
//     //   { _id: userId },
//     //   { "activity.activity_timestamp": new Date() },
//     //   { runValidators: true }
//     // );
//   } catch (error: any) {
//     throw handleApiError(error, "updateActivityTimestamp service error.", 500);
//   }
// }

// /**
//  * ...
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
