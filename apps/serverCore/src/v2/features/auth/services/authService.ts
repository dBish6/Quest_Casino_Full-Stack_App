import { ObjectId, Types } from "mongoose";
import type RegisterRequestDto from "../dtos/RegisterRequestDto";

import { hash } from "bcrypt";

import { logger } from "@qc/utils";
import { createApiError } from "@utils/CustomError";
import sendEmail from "@utils/sendEmail";

import { User, UserStatistics, UserActivity } from "@authFeat/models";
import { clearAllSessions } from "./jwtService";
import { deleteAllCsrfTokens } from "./csrfService";

export async function getUsers() {
  try {
    return await User.find();
  } catch (error: any) {
    throw createApiError(error, "getUsers service error.", 500);
  }
}

export async function getUser(
  by: "_id" | "email",
  value: ObjectId | string,
  fields?: string
) {
  try {
    let userQuery = User.findOne({ [by]: value });
    if (fields) userQuery = userQuery.select(fields);
    return await userQuery.exec();
  } catch (error: any) {
    throw createApiError(error, "getUser service error.", 500);
  }
}

export async function registerStandardUser({ body: user }: RegisterRequestDto) {
  try {
    if (user.type === "standard") user.password = await hash(user.password, 12);
    else user.password = `${user.type} provided`;

    const newUser = new User({
        _id: new Types.ObjectId(),
        ...user,
      }),
      userStatistics = new UserStatistics({ _id: newUser._id }),
      userActivity = new UserActivity({ _id: newUser._id });

    Promise.all([newUser.save(), userStatistics.save(), userActivity.save()]);

    await newUser.updateOne({
      statistics: userStatistics._id,
      activity: userActivity._id,
    });

    logger.info(
      `User ${newUser._id} was successfully registered in the database.`
    );
  } catch (error: any) {
    throw createApiError(error, "register service error.", 500);
  }
}
// export async function registerGoogleUser(idToken: string) {
//   try {

//   } catch (error: any) {
//     throw new ApiError("login service error.", error.message);
//   }
// }

export async function emailVerify(email: string) {
  try {
    // const link = await auth.generateEmailVerificationLink(email);

    // const html = `Greetings, thank you so much for your endeavour through Quest Casino.<br><br>
    //   To verify your email, <a href="${link}"> click here </a>.`,

    // template = fs.readFileSync(path.resolve("./src/index.html"), "utf-8");
    // const html = template.replace("<!--ssr-outlet-->", appHtml);

    const info = await sendEmail(email, "Email Verification", "html");
  } catch (error: any) {
    throw createApiError(error, "deleteCsrfToken service error.", 500);
  }
}

export async function updateActivityTimestamp(userId: ObjectId | string) {
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { activity_timestamp: new Date() } },
      { runValidators: true }
    );
  } catch (error: any) {
    throw createApiError(error, "updateActivityTimestamp service error.", 500);
  }
}

export async function wipeUser(userId: ObjectId | string) {
  try {
    await Promise.all([
      clearAllSessions(userId.toString()),
      deleteAllCsrfTokens(userId.toString()),
    ]);
  } catch (error: any) {
    throw createApiError(error, "deleteUser service error.", 500);
  }
}

export async function deleteUser(userId: ObjectId | string) {
  try {
    await Promise.all([
      User.deleteOne({ _id: userId }),
      clearAllSessions(userId.toString()),
    ]);
  } catch (error: any) {
    throw createApiError(error, "deleteUser service error.", 500);
  }
}
