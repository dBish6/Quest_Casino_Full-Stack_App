import { model } from "mongoose";
import mongooseAutopopulate from "mongoose-autopopulate";
import userSchema, {
  userStatisticsSchema,
  userActivitySchema,
} from "./schemas/userSchema";
import "./middleware";

userSchema.plugin(mongooseAutopopulate);

export const User = model("user", userSchema),
  UserStatistics = model("userStatistics", userStatisticsSchema),
  UserActivity = model("userActivity", userActivitySchema);
