import type { CallbackWithoutResultAndOptionalError } from "mongoose";
import { handleApiError } from "@utils/handleError";
import userSchema from "./schemas/userSchema";

interface MongoError extends Error {
  code: number;
  keyPattern: any;
}

function handleUniqueUsername(
  monError: Error,
  _: any,
  next: CallbackWithoutResultAndOptionalError
) {
  const error = monError as MongoError;
  if (error.code === 11000 && error.keyPattern?.username)
    throw handleApiError(
      Error("Username is already taken. Please try a different username."),
      "handleUniqueUsername error.",
      400
    );

  next();
}

userSchema.post("save", { errorHandler: true }, handleUniqueUsername);
userSchema.post("updateOne", { errorHandler: true }, handleUniqueUsername);
userSchema.post("findOneAndUpdate", { errorHandler: true }, handleUniqueUsername); // prettier-ignore

async function handleMaxFriends(
  monError: Error,
  _: any,
  next: CallbackWithoutResultAndOptionalError
) {
  const error = monError as MongoError;
  if (error.code === 11000 && error.keyPattern?.friends)
    throw handleApiError(
      Error("Your max 25 friends has been reached."),
      "handleMaxFriends error.",
      400
    );

  next();
}

userSchema.post("findOneAndUpdate", { errorHandler: true }, handleMaxFriends);
