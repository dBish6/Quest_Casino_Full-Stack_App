import { model } from "mongoose";
import userSchema from "./userSchema";
import { ApiError } from "@utils/CustomError";

userSchema.pre("save", (next) => {
  const user = this as any;

  if (user.isModified("_id")) {
    throw new ApiError(
      "userSchema middleware error.",
      "Unexpected change occurred within the user document",
      400
    );
  }

  user.updated_at = new Date();
  next();
});

const User = model("user", userSchema);

export { User };
