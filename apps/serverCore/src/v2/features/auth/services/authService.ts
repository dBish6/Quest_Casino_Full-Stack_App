/**
 * General Auth Service
 *
 * Description:
 * Handles functionalities related to user authentication and management that can be for HTTP or Sockets.
 */

import type { ObjectId, PopulateOptions, Query, UpdateQuery, QueryOptions } from "mongoose";
import type { GetUserBy, UserDoc, UserDocFriends, UserDocStatistics, UserDocActivity, UserDocNotifications } from "@authFeat/typings/User";

import CLIENT_COMMON_EXCLUDE from "@constants/CLIENT_COMMON_EXCLUDE";

import { handleApiError, ApiError } from "@utils/handleError";

import { User, UserFriends, UserStatistics, UserActivity, UserNotifications } from "@authFeat/models";

export interface Identifier<TBy> {
  by: TBy;
  value: ObjectId | string;
}

/**
 * Type `UserCredentials` (minus the friends because they get initialized elsewhere).
 */
export const CLIENT_USER_FIELDS = `${CLIENT_COMMON_EXCLUDE} -email -password -friends -activity -notifications`;

/**
 * Type `MinUserCredentials`.
 */
export const MINIMUM_USER_FIELDS = "-_id avatar_url legal_name username verification_token";

/**
 * Type `FriendCredentials`.
 */
export const FRIEND_FIELDS = `${MINIMUM_USER_FIELDS} country bio`

export const USER_FRIENDS_POPULATE: PopulateOptions[] = [
  { 
    path: "pending.$*",
    select: MINIMUM_USER_FIELDS
  },
  { 
    path: "list.$*",
    select: FRIEND_FIELDS
  }
];

/**
 * Populates specific fields on the `UserDoc` for the client or internal use.
 */
export function populateUserDoc<TUserDoc = UserDoc>(query: Query<any, UserDoc>) {
  return {
    full: (): Query<TUserDoc | null, UserDoc> =>
      query.populate([
        {
          path: "friends",
          populate: USER_FRIENDS_POPULATE
        },
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
    client: (): Query<TUserDoc | null, UserDoc> =>
      query.select(CLIENT_USER_FIELDS).populate([
        {
          path: "statistics",
          select: CLIENT_COMMON_EXCLUDE
        }
      ]),
    min: (): Query<TUserDoc | null, UserDoc> => query.select(MINIMUM_USER_FIELDS) as any
  };
}

/**
 * Populates specific fields on the `UserDocFriends`.
 */
function populateUserFriendsDoc(query: Query<UserDocFriends | null, UserDocFriends>) {
  return query.select(CLIENT_COMMON_EXCLUDE).populate(USER_FRIENDS_POPULATE);
}

/**
 * Gets all users or a random set of users from the database.
 * @param randomize Serves as a flag and limit of users taken.
 */
export async function getUsers(forClient?: boolean, randomize?: number) {
  try {
    const query = User.find();

    if (randomize && !isNaN(randomize)) {
      const totalUsers = await User.countDocuments();
      query.skip(Math.floor(Math.random() * (totalUsers - randomize))).limit(randomize);
    }
    
    return await populateUserDoc<UserDoc[]>(query)[
      forClient ? (randomize ? "min" : "client") : "full"
    ]();
  } catch (error: any) {
    throw handleApiError(error, "getUsers service error.");
  }
}

/**
 * Gets a user from the database optionally for the client or internal use.
 */
export async function getUser(
  by: GetUserBy,
  value: ObjectId | string,
  forClient?: boolean
) {
  try {
    return await populateUserDoc(User.findOne({ [by]: value }))[
      forClient ? "client" : "full"
    ]();
  } catch (error: any) {
    throw handleApiError(error, "getUser service error.");
  }
}

/**
 * Gets a friend document for a specific user from the database.
 */
export async function getUserFriends(userId: ObjectId | string, options?: QueryOptions<UserDocFriends>) {
  try {
    const userFriends = await populateUserFriendsDoc(UserFriends.findById(userId, {}, options));
    if (!userFriends) 
      throw new ApiError("Unexpectedly couldn't find the user's friends after validation.", 404, "not found");

    return userFriends;
  } catch (error: any) {
    throw handleApiError(error, "getUser service error.");
  }
}

/**
 * Updates any field in the user's `UserDoc` (base document).
 * @throws `ApiError` if the document is not found.
 */
export async function updateUserCredentials(
  identifier: Identifier<GetUserBy>,
  update: UpdateQuery<UserDoc>,
  options?: QueryOptions<UserDoc> & { forClient?: boolean }
) {
  const { by, value } = identifier,
    { forClient, ...restOpts } = options || {};
  
  try {
    const user = await populateUserDoc(User.findOneAndUpdate({ [by]: value }, update, restOpts))[
      forClient ? "client" : "full"
    ]();
    if (!user) throw new ApiError("Unexpectedly the user was not found.", 404, "not found");

    return user;
  } catch (error: any) {
    throw handleApiError(error, "updateUserCredentials service error.");
  }
}

/**
 * Updates any field in the user's friends document.
 * @throws `ApiError` if the document is not found.
 */
export async function updateUserFriends(
  identifier: Identifier<"_id">,
  update: UpdateQuery<UserDocFriends>,
  options?: QueryOptions<UserDocFriends>
) {
  const { by, value } = identifier;

  try {
    const userFriends = await populateUserFriendsDoc(
      UserFriends.findOneAndUpdate({ [by]: value }, update, options)
    );
    if (!userFriends) throw new ApiError("Unexpectedly user friends was not found.", 404, "not found");

    return userFriends;
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.");
  }
}

/**
 * Updates any field in the user's statistics document.
 * @throws `ApiError` if the document is not found.
 */
export async function updateUserStatistics(
  identifier: Identifier<"_id">,
  update: UpdateQuery<UserDocStatistics>,
  options?: QueryOptions<UserDocStatistics>
) {
  const { by, value } = identifier;

  try {
    const userStatistics = await UserStatistics.findOneAndUpdate({ [by]: value }, update, options);
    if (!userStatistics) throw new ApiError("Unexpectedly user statistics was not found.", 404, "not found");

    return userStatistics;
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.");
  }
}

/**
 * Updates any field in the user's activity document.
 * @throws `ApiError` if the document is not found.
 */
export async function updateUserActivity(
  identifier: Identifier<"_id">,
  update?: UpdateQuery<UserDocActivity>,
  options?: QueryOptions<UserDocActivity>
) {
  const { by, value } = identifier;
  
  try {
    const userActivity = await UserActivity.findOneAndUpdate({ [by]: value }, update, options);
    if (!userActivity) throw new ApiError("Unexpectedly user activity was not found.", 404, "not found");

    return userActivity;
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.");
  }
}

/**
 * Updates any field in the user's notifications document.
 * @throws `ApiError` if the document is not found.
 */
export async function updateUserNotifications(
  identifier: Identifier<"_id">,
  update: UpdateQuery<UserDocNotifications>,
  options?: QueryOptions<UserDocNotifications>
) {
  const { by, value } = identifier;

  try {
    const userNotifications =
      await UserNotifications.findOneAndUpdate({ [by]: value }, update, options);
    if (!userNotifications) 
      throw new ApiError("Unexpectedly user notifications was not found.", 404, "not found");

    return userNotifications;
  } catch (error: any) {
    throw handleApiError(error, "updateActivityTimestamp service error.");
  }
}
