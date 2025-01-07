/**
 * HTTP Auth Service
 *
 * Description:
 * Handles HTTP-related functionalities related to user authentication and management.
 */

import type { ObjectId } from "mongoose";
import type { InitializeUser, UserNotification, UserNotificationField, UserClaims, UserDoc, User as UserFields } from "@authFeat/typings/User";

import type { Notification } from "@qc/typescript/dtos/NotificationsDto";
import type { UpdateProfileBodyDto, UpdateUserFavouritesBodyDto, SendConfirmPasswordEmailBodyDto } from "@qc/typescript/dtos/UpdateUserDto";

import { Types, isValidObjectId, startSession  } from "mongoose";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { hash, compare } from "bcrypt";

import { AVATAR_FILE_EXTENSIONS } from "@qc/constants";
import GENERAL_BAD_REQUEST_MESSAGE from "@constants/GENERAL_BAD_REQUEST_MESSAGE";
import USER_NOT_FOUND_MESSAGE from "@authFeat/constants/USER_NOT_FOUND_MESSAGE";

import { logger, delay } from "@qc/utils";
import { handleHttpError, HttpError } from "@utils/handleError";
import trackAttempts from "@authFeatHttp/utils/trackAttempts";
import isUuidV4 from "@utils/isUuidV4";

import { User, UserFriends, UserStatistics, UserActivity, UserNotifications } from "@authFeat/models";
import { PrivateChatMessage } from "@chatFeat/models";
import { redisClient } from "@cache";
import { s3 } from "@aws";

import { MINIMUM_USER_FIELDS, updateUserCredentials, getUser } from "@authFeat/services/authService";
import { formatEmailTemplate, sendEmail } from "@authFeatHttp/services/emailService";
import { GenerateUserJWT, revokeVerificationToken, clearAllSessions, JWTVerification  } from "@authFeat/services/jwtService";
import { deleteCsrfToken, deleteAllCsrfTokens } from "@authFeatHttp/services/csrfService";

const { AWS_REGION, AWS_S3_BUCKET } = process.env;
const ALLOWED_PROFILE_UPDATE_FIELDS: ReadonlySet<string> = new Set(["avatar_url", "first_name", "last_name", "username", "bio", "email", "country", "region", "phone_number", "settings"]),
  ALLOWED_PROFILE_UPDATE_SETTINGS_FIELDS: ReadonlySet<string> = new Set(["notifications", "blocked_list", "visibility", "block_cookies"]);

const PASSWORD_CACHE_KEY = (userId: ObjectId | string) => `user:${userId.toString()}:pending_password`;

/**
 * Registers a new user in the database.
 */
export async function registerUser(user: InitializeUser) {
  const userId = new Types.ObjectId();

  try {
    if (user.password && user.type === "standard") user.password = await hash(user.password, 12);
    else user.password = `${user.type} provided`;

    const session = await startSession();

    await session.withTransaction(async () => {
      const docs = [
        new User({
          _id: userId,
          legal_name: { first: user.first_name, last: user.last_name },
          friends: userId,
          statistics: userId,
          activity: userId,
          notifications: userId,
          ...user
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
 * @throws `HttpError 403` invalid verification token.
 * @throws `HttpError 404` user not found.
 */
export async function emailVerify(userId: ObjectId | string) {
  try {
    const updatedUser = await updateUserCredentials(
      { by: "_id", value: userId },
      { $set: { email_verified: true } },
      { new: true, lean: true }
    );
    await revokeVerificationToken(userId);
    
    return updatedUser;
  } catch (error: any) {
    throw handleHttpError(error, "emailVerify service error.");
  }
}
/**
 * Sends an email with a verification link to the specified email address.
 * @throws `HttpError 541` SMTP rejected.
 */
export async function sendVerifyEmail(user: UserClaims) {
  const generateJWT = new GenerateUserJWT();

  try {
    const verificationToken = await generateJWT.verificationToken(user);
    await sendEmail(user.email, formatEmailTemplate("verify", { token: verificationToken }));
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
    }).select(MINIMUM_USER_FIELDS).limit(50).lean();
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
                [`notifications.${toDelete.type}`]: { notification_id: toDelete.notification_id }
              }
            }
          }
        }))
      );
    } else {
      const toDelete = notifications[0];
      await UserNotifications.findOneAndUpdate(
        { _id: userId },
        { $pull: { [`notifications.${toDelete.type}`]: { notification_id: toDelete.notification_id } } }
      );
    }

    return getSortedUserNotifications(userId, categorize);
  } catch (error: any) {
    throw handleHttpError(error, "deleteUserNotifications service error.");
  }
}

/**
 * Gets specific user profile data from the database needed for the client.
 * @throws `HttpError 404` user not found.
 */
export async function getUserProfile(idOrUsername: ObjectId | string) {
  try {
    if (isValidObjectId(idOrUsername)) {
      const profileData = await User.aggregate([
        { $match: { _id: new Types.ObjectId(idOrUsername as string) } },
        {
          $lookup: {
            from: "user_activity",
            localField: "activity",
            foreignField: "_id",
            as: "activityData"
          }
        },
        { $unwind: "$activityData" },
        { $unwind: "$activityData.game_history" },
        { $sort: { "activityData.game_history.timestamp": -1 } },
        {
          $group: {
            _id: 0,
            email: { $first: "$email" },
            game_history: { $push: "$activityData.game_history" }
          }
        },
        {
          $project: {
            _id: 0,
            email: 1,
            activity: { game_history: "$game_history" }
          }
        }
      ]);
      if (!profileData?.length) throw new HttpError(USER_NOT_FOUND_MESSAGE, 404);

      return profileData[0];
    } else if (typeof idOrUsername === "string") {
      // TODO:
      const user = await getUser("username", idOrUsername, { lean: true });
    }

    throw new HttpError("Access Denied", 403);
  } catch (error: any) {
    throw handleHttpError(error, "getUserProfile service error.");
  }
}

/**
 * Updates the user's profile details based on the client edit.
 * @throws `HttpError 400` when avatar_url is not a image or the url isn't valid.
 * @throws `HttpError 403` forbidden if a unusual key is passed in the body or if there is more fields in the body when the avatar_url is requested.
 * @throws `HttpError 404` user not found.
 * @throws `HttpError 409` conflict if there is a pending password and they request to change their email. 
 * @throws `HttpError 429` too many update attempts.
 */
export async function updateProfile(user: UserClaims, body: UpdateProfileBodyDto) {
  try {
    return await trackAttempts<{ updatedUser: UserDoc; updatedFields: UpdateProfileBodyDto }>(
      user.sub,
      "update_profile_attempts",
      "Profile update limit reached. You can only attempt to update your profile up to 6 times within a 24-hour period. Please try again later.",
      async () => {
        if ((await redisClient.get(PASSWORD_CACHE_KEY(user.sub))) && body.email)
          throw new HttpError(
            "Confirmation is still pending for your password change. Please confirm the change via your current email before attempting to change your email. You can also cancel password reset.",
            409
          );

        const bodyKeys = Object.keys(body);

        for (const field of bodyKeys) {
          if (!ALLOWED_PROFILE_UPDATE_FIELDS.has(field))
            throw new HttpError("Access Denied; Invalid credentials.", 403);
          else if (!body[field as keyof UpdateProfileBodyDto]) delete body[field as keyof UpdateProfileBodyDto];

          if (field === "settings") {
            for (const settingField of Object.keys(body.settings!)) {
              if (!ALLOWED_PROFILE_UPDATE_SETTINGS_FIELDS.has(settingField)) 
                throw new HttpError("Access Denied; Invalid credentials.", 403);
            }
          }
        }

        let query: {
          $set: { [key in keyof UserFields]?: any };
          $unset: { [key in keyof UserFields]?: any };
        } = { $set: {}, $unset: {} };
        // Single updates for the avatar.
        if (body.avatar_url) {
          if (bodyKeys.length > 1) throw new HttpError("Access Denied", 403);
 
          const match = (body.avatar_url as string).match(/^data:image\/(.*?);base64,(.+)$/);
          if (!AVATAR_FILE_EXTENSIONS.has((match || [""])[1])) 
            throw new HttpError("The avatar_url is not a image or the url isn't valid.", 400);

          const fileBuffer = Buffer.from(match![2], "base64");
          if (fileBuffer.length > 500 * 1024)
            throw new HttpError("File size exceeds the maximum size of 500 KB.", 400);

          const ext = match![1],
            path = `avatars/${user.member_id}/avatar.${ext}`;

          // Overrides
          await s3.send(
            new DeleteObjectCommand({ Bucket: AWS_S3_BUCKET, Key: path})
          );
          await s3.send(new PutObjectCommand({
            Bucket: AWS_S3_BUCKET,
            Key: path,
            Body: Buffer.from(match![2], "base64"),
            ContentType: `image/${ext}`,
            ACL: "public-read"
          }));

          query.$set.avatar_url = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${path}`;
        }
        // Only should be their settings being updated. 
        else if (body.settings) {
          if (bodyKeys.length > 1) throw new HttpError("Access Denied", 403);

          if (body.settings.blocked_list) {
            for (const user of body.settings.blocked_list) {
              if (!["delete", "add"].includes(user.op) || !isUuidV4(user.member_id))
                throw new HttpError(GENERAL_BAD_REQUEST_MESSAGE, 400);

              if (user.op === "add") {
                if (body.settings!.blocked_list.length > 1) throw new HttpError("Access Denied", 403); // Should never be multiple users being blocked (you can only block when viewing a single user profile).

                const userDoc = await getUser("member_id", user.member_id, {
                  projection: "_id",
                  lean: true
                });
                if (!userDoc)
                  throw new HttpError(
                    "Unexpectedly, this user was not found to block, this profile doesn't exist.", 404
                  );

                query.$set = { [`settings.blocked_list.${user.member_id}`]: userDoc._id };
              } else {
                (query.$unset as any)[`settings.blocked_list.${user.member_id}`] = "";
              }
            }
          }
        }
        // Everything else.
        else {
          const { first_name, last_name, ...rest } = body;
          query.$set = {
            ...rest,
            ...(first_name && { "legal_name.first": first_name }),
            ...(last_name && { "legal_name.last": last_name }),
            ...(rest.email && { email_verified: false })
          };
        }

        const updatedUser = await User.findOneAndUpdate(
          {
            _id: user.sub,
            $expr: { $lte: [{ $ifNull: ["$limit_changes.country", 0] }, 2] } // Only can be 2 changes to their country.
          },
          {
            ...query,
            ...(query.$set.country && {
              $inc: { "limit_changes.country": 1 },
              ...(!query.$set.region && { $unset: { region: "" } })
            })
          },
          { new: true }
        )
        .select(
          `-_id ${bodyKeys} ${(query.$set as any)["legal_name.first"] || (query.$set as any)["legal_name.first"] ? "legal_name" : ""}`
        )
        .lean();
        if (!updatedUser) {
          // Checks if the reason wasn't because of the id.
          const exists = await User.exists({ _id: user.sub });
          if (!exists) throw new HttpError(USER_NOT_FOUND_MESSAGE, 404);

          throw new HttpError("Country update limit reached. You can only update your country 2 times.", 400);
        }

        return {
          ...(query.$set.email && {
            updatedUser: {
              ...(await getUser("_id", user.sub, {
                lean: true,
                throwDefault404: true
              }))
            }
          }),
          updatedFields: updatedUser
        };
      }
    );
  } catch (error: any) {
    throw handleHttpError(error, "updateProfile service error.", 500);
  }
}

/**
 * Updates the user's favourite games in bulk by either adding or deleting
 * entries from the database.
 */
export async function updateUserFavourites(
  userId: ObjectId | string,
  favourites: UpdateUserFavouritesBodyDto["favourites"]
) {
  try {
    await User.bulkWrite(
      favourites.map((favourite) => {
        if (!["delete", "add"].includes(favourite.op) || !favourite.title)
          throw new HttpError(GENERAL_BAD_REQUEST_MESSAGE, 400);

        const isAdd = favourite.op === "add";
        return {
          updateOne: {
            filter: { _id: userId },
            update: {
              [isAdd ? "$set" : "$unset"]: {
                [`favourites.${favourite.title}`]: isAdd ? true : ""
              }
            }
          }
        };
      })
    );
    const updatedUser = await User.findById(userId).select("favourites").lean();
    if (!updatedUser) throw new HttpError(USER_NOT_FOUND_MESSAGE, 404);

    return updatedUser?.favourites;
  } catch (error: any) {
    throw handleHttpError(error, "updateUserFavourites service error.");
  }
}

/**
 * Updates the user's password in the database, clears all sessions and sends a success email.
 * @throws `HttpError 404` no pending password.
 */
export async function resetPassword(userId: string, email: string) {
  try {
    await trackAttempts(
      userId,
      "reset_password_attempts",
      "Too many reset password attempts, limit has been reached. Try again later after 24 hours.",
      async () => {
        const pendingPassword = await redisClient.get(PASSWORD_CACHE_KEY(userId));
        // This error should pretty much never happen since the token and this cache entry has the same expiry.
        if (!pendingPassword)
          throw new HttpError("It looks like your password reset has expired right at this moment of submission. Unlucky, Please request a new one.", 404);
        
        await updateUserCredentials(
          { by: "_id", value: userId },
          { $set: { password: pendingPassword } }
        );
        await Promise.all([
          wipeUser(userId),
          revokeVerificationToken(userId)
        ]);

        await sendEmail(email, formatEmailTemplate("passwordResetSuccess"));
      },
      { max: 4 }
    );
  } catch (error: any) {
    throw handleHttpError(error, "resetPassword service error.");
  }
}

/**
 * Sends a confirmation email with a verification token to confirm their password change.
 * Handles both forgot password and profile password reset flows.
 * @throws `HttpError 400` passwords doesn't match if reset.
 * @throws `HttpError 404` user not found if reset.
 */
export async function sendConfirmPasswordEmail(
  userId: string,
  email: string, 
  body: SendConfirmPasswordEmailBodyDto
) {
  const generateJWT = new GenerateUserJWT();

  try {
    await trackAttempts(
      userId,
      "reset_password_attempts",
      "Too many reset password attempts, limit has been reached. Try again later after 24 hours.",
      async () => {
        const isForgot = "verification_token" in body; // From forgot reset form else from profile reset form.
        let newPassword = isForgot ? body.password : body.password.new as string;

        const user = await getUser("_id", userId, {
          projection: "-_id password",
          lean: true,
          throwDefault404: true
        });
        if (await compare(newPassword, user.password)) throw new HttpError("Please provide a new password.", 400);

        if (!isForgot && !(await compare(body.password.old as string, user.password)))
            throw new HttpError("Old password doesn't match your existing password.", 400);

        newPassword = await hash(isForgot ? body.password : body.password.new as string, 12);
         const [verificationToken] = await Promise.all([
            generateJWT.verificationToken({ _id: userId, email }, { expiresIn: 15 * 60 }),
            redisClient.set(PASSWORD_CACHE_KEY(userId), newPassword, { EX: 15 * 60 })
          ]);

        await sendEmail(email, formatEmailTemplate("confirmPassword", { token: verificationToken }));
      }
    );
  } catch (error: any) {
    throw handleHttpError(error, "sendConfirmPasswordEmail service error.");
  }
}

/**
 * Generates a verification token and sends the forgot password email if the user exists.
 */
export async function sendForgotPasswordEmail(email: string) {
  const generateJWT = new GenerateUserJWT();

  try {
    const user = await getUser("email", email, { projection: "email", lean: true });

    if (user) {
      const verificationToken = await generateJWT.verificationToken(user, { expiresIn: 60 * 60 * 24 }); // 24 hours.
      await sendEmail(user.email, formatEmailTemplate("forgotPassword", { token: verificationToken }));
    } else {
      await delay(200);
    }
  } catch (error: any) {
    throw handleHttpError(error, "sendForgotPasswordEmail service error.");
  }
}

/**
 * Deletes the verification token and pending password from the cache.
 */
export async function revokePasswordResetConfirmation(userId: ObjectId | string) {
  try {
    await Promise.all([
      revokeVerificationToken(userId),
      redisClient.del(PASSWORD_CACHE_KEY(userId))
    ]);
  } catch (error: any) {
    throw handleHttpError(error, "revokePasswordResetConfirmation service error.");
  }
}

/**
 * Logs out the user by attempting to find the user through the access and refresh tokens. If that fails,
 * it falls back to retrieving the user from the database. Lastly, deleting the user's cached CSRF token
 * if the user is found
 * @throws `HttpError 404` user not found.
 */
export async function logout(
  { access = "", refresh = "" },
  username: string,
  csrfToken = ""
) {
  const jwtVerification  = new JWTVerification();

  try {
    let user;

    user = jwtVerification.getFirstValidUserClaims({ access, refresh });
    if (!user) {
      user = await getUser("username", username, {
        projection: "_id",
        lean: true
      });
      if (!user)
        throw new HttpError("Unexpectedly couldn't find the user after login.", 404);
    }

    await deleteCsrfToken((user as UserClaims).sub || user._id, csrfToken);

    return user;
  } catch (error: any) {
    throw handleHttpError(error, "logout service error.");
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
    throw handleHttpError(error, "deleteUser service error.");
  }
}

/**
 * Deletes a user from the database and their refresh tokens.
 * TODO:
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
