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

function commonMiddleware(next: CallbackWithoutResultAndOptionalError) {
  // @ts-ignore
  const doc = this as SharedDocument;

  if (!doc.isNew) {
    if (doc.isModified("_id")) {
      throw createApiError(
        null,
        "commonMiddleware error.",
        400,
        "Unexpected change occurred within a document"
      );
    }
  }

  next();
}

// FIXME: I want this middleware to run on every operation, but this is probably not needed...
[userSchema, userStatisticsSchema, userActivitySchema].forEach(
  (schema: Schema<any, any>) => {
    schema.pre("validate", commonMiddleware);
  }
);
