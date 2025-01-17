import type { ActionFunction } from "react-router-dom";

import { json, redirect } from "react-router-dom";
import { AVATAR_FILE_EXTENSIONS } from "@qc/constants";
import { logger, capitalize, validateEmail } from "@qc/utils";

const optionalFields = new Set(["region", "calling_code", "phone_number"]); // For anything other then profile.

/**
 * Validates form fields in user forms (register, update profile, reset password, forgot password).
 */
const validateUserAction: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData(),
      result = await validate(formData);

    if (Object.keys(result.errors).length) return json({ errors: result.errors }, { status: 400 });
    else return json({ reqBody: result.reqBody }, { status: 200 });
  } catch (error: any) {
    logger.error("validateUser error:\n", error.message);
    return json({ ERROR: error.message }, { status: 500 });
  }
};
export default validateUserAction;

async function validate(formData: FormData) {
  const botField = formData.get("bot");
  if (botField && botField.toString().length) return { errors: { bot: "Access Denied" } };
  formData.delete("bot");

  const isProfile = formData.get("isProfile");
  formData.delete("isProfile");

  const errors: Record<string, string> = {},
    reqBody: Record<string, string | { old: string, new: string }> = {};

  for (const [key, value] of formData.entries()) {
    if (key === "calling_code") continue;
    let fieldValue: string | File = value instanceof File ? value : value.toString();
    const isPassword = ["old_password", "new_password"].includes(key);

    if (fieldValue instanceof File) {
      // For avatar_url.
      if (key !== "avatar_url") errors[key] = "Application error."; // Should never happen.

      const errorMsg = validateField(key, fieldValue, formData);
      if (errorMsg) errors.global = errorMsg;

      fieldValue = await transformFileToDataUrl(fieldValue);
      if (fieldValue === "Failed to upload.") errors.avatar_url = fieldValue;
      else reqBody.avatar_url = fieldValue;

    } else if (fieldValue.length) {
      if (key === "avatar_url") redirect("/error-403");

      const errorMsg = validateField(key, fieldValue, formData);
      if (errorMsg) {
        if (errorMsg === "Passwords do not match.") {
          errors.password = errorMsg;
          errors.con_password = errorMsg;
        } else {
          errors[
            key === "phone_number" && errorMsg.includes("calling code", -1) ? "calling_code" : key
          ] = errorMsg;
        }
      } else if (key !== "con_password" && !isPassword) {
        // Forms the correct request body.
        reqBody[key] = key === "phone_number" ? `${formData.get("calling_code")} ${fieldValue}` : fieldValue;
      }
    } else if (((isProfile && isPassword) || (!isProfile && !optionalFields.has(key)))) {
      errors[key] =
        key === "con_password"
          ? "Please confirm your password."
          : key === "old_password"
            ? "Your current password is required."
            : `${capitalize(key)} is required.`;
    }
  }

  return { errors, reqBody };
}
function validateField(key: string, value: string | File, formData: FormData) {
  switch (key) {
    case "avatar_url":
      return validateAvatar(value as File);
    case "username":
      return validateUsername(value as string);
    case "email":
      return validateEmail(value as string);
    case "password":
    case "new_password":
      return validatePassword(key, value as string); 
    case "con_password":
      return confirmPassword(value as string, formData.get("password")!.toString());
    case "phone_number":
      return validatePhoneNumber(value as string, formData.get("calling_code")!.toString());
    default:
      return null;
  }
}

/**
 * Constraints:
 * - Must be a jpg, png, or webp.
 * - Can't be greater than 500kb.
 */
function validateAvatar(file: File) {
  if (!AVATAR_FILE_EXTENSIONS.has(file.type.split("/")[1]))
    return "Invalid file format. The file must be a jpg, jpeg, png, or webp.";

  if (file.size > 500 * 1024)
    return "File size exceeds the maximum size of 500 KB.";
}

/**
 * Constraints:
 * - Min of 3 characters.
 * - Max of 24 characters.
 */
function validateUsername(username: string) {
  if (username.length < 3) return "You can make a better username then that.";
  else if (username.length > 24) return "Username can't be no more than 24 characters";
}

/**
 * Constraints:
 * - Min of 6 characters.
 * - Max of 128 characters.
 * - At least one uppercase letter.
 * 
 * Also, checks their old password for password resets.
 */
function validatePassword(key: string, password: string) {
  if (password.length < 6) return `${capitalize(key)} must be at least 6 characters.`;
  else if (password.length > 128) return "Max of 128 characters exceeded.";
  else if (!/[A-Z]/.test(password))
    return `${capitalize(key)} must contain at least one capital letter.`;
}
function confirmPassword(conPassword: string, password: string) {
  if (conPassword !== password) return "Passwords do not match.";
}

/**
 * Constraints:
 * - Must be 14 characters because of the format.
 * - If a phone number is provided, the calling code is required.
 */
function validatePhoneNumber(phoneNumber: string, callingCode: string) {
  if (phoneNumber.length !== 14) return "Phone number is invalid.";
  else if (!callingCode.length) return "Enter your calling code.";
}

function transformFileToDataUrl(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve("Failed to upload.");

    reader.readAsDataURL(file);
  });
}
