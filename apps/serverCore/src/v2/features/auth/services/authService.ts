/**
 * General Auth Service
 *
 * Description:
 * Handles functionalities related to user authentication and management that can be for HTTP or Sockets.
 */

import type { ObjectId, Query, QueryOptions, UpdateQuery } from "mongoose";
import type { GetUserBy, UserDoc, UserDocStatistics, UserDocActivity, UserDocNotifications } from "@authFeat/typings/User";

import { handleApiError } from "@utils/handleError";

import { User, UserStatistics, UserActivity, UserNotifications } from "@authFeat/models";

export interface Identifier<TBy> {
  by: TBy;
  value: ObjectId | string;
}

export const FRIEND_FIELDS = "avatar_url legal_name username verification_token country bio"; // FriendCredentials type.

export const CLIENT_USER_SHARED_EXCLUDE = "-_id -created_at -updated_at",
  CLIENT_USER_FIELDS = `${CLIENT_USER_SHARED_EXCLUDE} -email -password -activity -notifications`, // UserCredentials type.
  MINIMUM_USER_FIELDS = "-_id avatar_url legal_name username";

/**
 * Populates specific fields for the client or internal use.
 */
export function populateUser<TUserDoc = UserDoc>(userQuery: Query<any, UserDoc>) {
  const query = userQuery.populate([
    {
      path: "friends.list",
      select: FRIEND_FIELDS,
      populate: {
        path: "activity",
        select: "activity_timestamp"
      }
    },
    {
      path: "friends.pending",
      select: MINIMUM_USER_FIELDS
    }
  ]);

  return {
    full: (): Query<TUserDoc, UserDoc> =>
      userQuery.populate([
        { path: "statistics" },
        { path: "activity" },
        {
          path: "notifications",
          populate: {
            path: "friend_requests",
            select: MINIMUM_USER_FIELDS,
          },
        },
      ]),
    client: async (): Promise<TUserDoc> => {
      const doc = await query.select(CLIENT_USER_FIELDS).populate({
        path: "statistics",
        select: CLIENT_USER_SHARED_EXCLUDE,
      })
      if (!doc) return doc;

      if (!doc.email_verified) delete doc._doc?.verification_token;
      return doc;
    }
  };
}

/**
 * Gets all users from the database.
 */
export async function getUsers(forClient?: boolean) {
  try {
    return await populateUser<UserDoc[]>(User.find())[forClient ? "client" : "full"]();
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
    return await populateUser(User.findOne({ [by]: value }))[
      forClient ? "client" : "full"
    ]();
  } catch (error: any) {
    throw handleApiError(error, "getUser service error.", 500);
  }
}

/**
 * Updates any field in the user's 'credentials' (base) document.
 */
export async function updateUserCredentials(
  identifier: Identifier<GetUserBy>,
  update: UpdateQuery<UserDoc>,
  options?: QueryOptions<UserDoc> & { forClient?: boolean }
) {
  const { by, value } = identifier,
    { forClient, ...restOpts } = options || {};
  
  try {
    return await populateUser(User.findOneAndUpdate({ [by]: value }, update, restOpts))[
      forClient ? "client" : "full"
    ]();
  } catch (error: any) {
    throw handleApiError(error, "updateUserCredentials service error.", 500);
  }
}

/**
 * Updates any field in the user's statistics document.
 */
export async function updateUserStatistics(
  identifier: Identifier<"_id">,
  update: UpdateQuery<UserDocStatistics>,
  options?: QueryOptions<UserDocStatistics>
) {
  const { by, value } = identifier;

  try {
    return await UserStatistics.findOneAndUpdate({ [by]: value }, update, options);
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.", 500);
  }
}

/**
 * Updates any field in the user's activity document.
 */
export async function updateUserActivity(
  identifier: Identifier<"_id">,
  update?: UpdateQuery<UserDocActivity>,
  // timestamp?: boolean, // Idk, add to options but there is a timestamps option.
  options?: QueryOptions<UserDocActivity>
) {
  const { by, value } = identifier;
  
  try {
    return await UserActivity.findOneAndUpdate(
      { [by]: value },
      // { ...(timestamp && { activity_timestamp: new Date() }), ...update },
      { activity_timestamp: new Date(), ...update },
      options
    );
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.", 500);
  }
}

/**
 * Updates any field in the user's notifications document.
 */
export async function updateUserNotifications(
  identifier: Identifier<"_id">,
  update: UpdateQuery<UserDocNotifications>,
  options?: QueryOptions<UserDocNotifications>
) {
  const { by, value } = identifier;

  try {
    return await UserNotifications.findOneAndUpdate({ [by]: value }, update, options);
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.", 500);
  }
}
