import { model } from "mongoose";
import userSchema, { userFriendsSchema, userStatisticsSchema, userActivitySchema, userNotificationsSchema } from "./schemas/userSchema";

export const User = model("user", userSchema),
  UserFriends = model("friends", userFriendsSchema),
  UserStatistics = model("statistics", userStatisticsSchema),
  UserActivity = model("activity", userActivitySchema),
  UserNotifications = model("notifications", userNotificationsSchema);
