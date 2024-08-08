import type { CallbackWithoutResultAndOptionalError } from "mongoose";
import { HttpError } from "@utils/handleError";
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
    throw new HttpError(
      "Username is already taken. Please try a different username.",
      400
    );

  next();
}

userSchema.post("save", { errorHandler: true }, handleUniqueUsername);
userSchema.post("updateOne", { errorHandler: true }, handleUniqueUsername);
userSchema.post("findOneAndUpdate", { errorHandler: true }, handleUniqueUsername); // prettier-ignore

async function handleMaxFriendsError(
  monError: Error,
  _: any,
  next: CallbackWithoutResultAndOptionalError
) {
  // TODO: Show on client.
  const error = monError as MongoError;
  if (error.code === 11000 && error.keyPattern?.friends)
    throw new HttpError(
      "Your max of 25 friends has been reached.",
      400
    );

  next();
}

userSchema.post("findOneAndUpdate", { errorHandler: true }, handleMaxFriendsError);
