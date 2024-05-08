import RegisterRequestDto from "../dtos/RegisterRequestDto";

import { hash } from "bcrypt";

import { ApiError } from "@utils/CustomError";
import sendEmail from "@utils/sendEmail";

import { User } from "@authFeat/models";
import { redisClient } from "@cache";

export async function getUsers(id: string) {
  try {
    return await User.findById(id);
  } catch (error: any) {
    throw new ApiError("getUsers service error.", error.message);
  }
}

export async function getUser(id: string) {
  try {
    return await User.find();
  } catch (error: any) {
    throw new ApiError("getUser service error.", error.message);
  }
}

export async function registerStandardUser({ body: user }: RegisterRequestDto) {
  try {
    if (user.type === "standard") user.password = await hash(user.password, 12);
    else user.password = `${user.type} provided`;

    const newUser = new User(user);
    newUser.save();
  } catch (error: any) {
    throw new ApiError("register service error.", error.message);
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
    throw new ApiError("deleteCsrfToken service error.", error.message);
  }
}

export async function updateActivityTimestamp(userId: string) {
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { activity_timestamp: new Date() } },
      { runValidators: true }
    );
  } catch (error: any) {
    throw new ApiError("updateActivityTimestamp service error.", error.message);
  }
}

export async function deleteUser(id: string) {
  try {
    // await Promise.all([
    //   auth.deleteUser(id),
    //   db.collection("user").doc(id).delete(),
    //   auth.revokeRefreshTokens(id),
    // ]);
  } catch (error: any) {
    throw new ApiError("deleteUser service error.", error.message);
  }
}
// export async function clearAllSessions(id: string) {
//   try {
//     await auth.revokeRefreshTokens(id);
//   } catch (error: any) {
//     throw new ApiError("clearAllSessions service error.", error.message);
//   }
// }
