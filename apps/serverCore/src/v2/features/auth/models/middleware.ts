import type {
  CallbackWithoutResultAndOptionalError,
  Document,
  Schema,
} from "mongoose";
import { createApiError } from "@utils/CustomError";
import userSchema, {
  userStatisticsSchema,
  userActivitySchema,
} from "./schemas/userSchema";

interface SharedDocument extends Document {
  updated_at: Date;
}

interface MongoError extends Error {
  code: number;
  keyPattern: any;
}

function commonMiddleware(next: CallbackWithoutResultAndOptionalError) {
  // @ts-ignore
  const doc = this as SharedDocument;
  if (!doc.isNew) {
    if (doc.isModified("_id")) {
      throw createApiError(
        Error(
          `Unexpected change occurred within a document:\n${JSON.stringify(doc.getChanges(), null, 2)}`
        ),
        "commonMiddleware error.",
        400
      );
    }
  }

  next();
}

[userSchema, userStatisticsSchema, userActivitySchema].forEach(
  (schema: Schema<any, any>) => {
    schema.pre(["save", "validate"], commonMiddleware);
  }
);

function handleUniqueUsername(
  monError: Error,
  doc: any,
  next: CallbackWithoutResultAndOptionalError
) {
  const error = monError as MongoError;
  if (error.code === 11000 && error.keyPattern?.username) {
    throw createApiError(
      Error("Username is already taken. Please try a different username."),
      "handleUniqueUsername error.",
      400
    );
  }

  next();
}

userSchema.post("save", { errorHandler: true }, handleUniqueUsername);
userSchema.post("updateOne", { errorHandler: true }, handleUniqueUsername);
