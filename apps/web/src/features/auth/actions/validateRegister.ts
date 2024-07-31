import type { ActionFunction } from "react-router-dom";
import type RegisterBodyDto from "@qc/typescript/dtos/RegisterBodyDto";

import { json } from "react-router-dom";
import { logger, capitalize, validateEmail } from "@qc/utils";

const optionalFields = new Set(["region", "calling_code", "phone_number"]);

const validateRegisterAction: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData(),
      result = validate(formData);

    if (Object.keys(result.errors).length) return json({ errors: result.errors }, { status: 400 });
    else return json({ reqBody: result.reqBody }, { status: 200 });
  } catch (error: any) {
    logger.error("registerAction error:\n", error.message);
    return json({ ERROR: error.message }, { status: 500 })
  }
};
export default validateRegisterAction;

function validate(formData: FormData) {
  if (formData.get("bot")!.toString().length) return { errors: { bot: "Access Denied" } };
  formData.delete("bot");

  const errors: Record<string, string> = {},
  reqBody: RegisterBodyDto = {} as RegisterBodyDto;

  for (const [key, value] of formData.entries()) {
    if (key === "calling_code") continue;
    const fieldValue = value.toString();

    if (fieldValue.length) {
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
      } else {
        // Forms the request body to be sent in the register request.
        reqBody[key as keyof RegisterBodyDto] =
          key === "phone_number" ? `${formData.get("calling_code")} ${fieldValue}` : fieldValue;
      }
    } else if (!optionalFields.has(key)) {
      errors[key] =
        key === "con_password"
          ? "Please confirm your password."
          : `${capitalize(key)} is required.`;
    }
  }

  return { errors, reqBody };
}
function validateField(key: string, value: string, formData: FormData) {
  switch (key) {
    case "username":
      return validateUsername(value);
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    case "con_password":
      return confirmPassword(value, formData.get("password")!.toString());
    case "phone_number":
      return validatePhoneNumber(value, formData.get("calling_code")!.toString());
    default:
      return null;
  }
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
 */
export function validatePassword(password: string) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  else if (password.length > 128) return "Max of 128 characters exceeded.";
  else if (!/[A-Z]/.test(password))
    return "Password must contain at least one capital letter.";
}
export function confirmPassword(conPassword: string, password: string) {
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
