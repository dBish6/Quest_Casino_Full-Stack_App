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
userSchema.post("findOneAndUpdate", { errorHandler: true }, handleUniqueUsername);
