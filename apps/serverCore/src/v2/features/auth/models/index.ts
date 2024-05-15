import { model } from "mongoose";
import userSchema, {
  userStatisticsSchema,
  userActivitySchema,
} from "./schemas/userSchema";
import "./middleware";

export const User = model("user", userSchema),
  UserStatistics = model("statistics", userStatisticsSchema),
  UserActivity = model("activity", userActivitySchema);
